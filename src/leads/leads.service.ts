import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDto, UpdateLeadStatusDto } from './dto/create-lead.dto';
import { Lead } from './schemas/lead.schema';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<Lead>,
  ) {}

  async create(brokerUserId: string, dto: CreateLeadDto) {
    const lead = await this.leadModel.create({
      broker_user_id: brokerUserId,
      client_user_id: dto.clientUserId,
      post_id: dto.postId,
    });
    this.logger.log(
      `lead_created broker=${brokerUserId} client=${dto.clientUserId}`,
    );
    return { data: lead };
  }

  /**
   * Engagement-driven lead creation. Same (broker, client, post) tuple resolves
   * to a single lead — repeated engagement does not generate duplicates.
   */
  async upsertEngagementLead(
    brokerUserId: string,
    clientUserId: string,
    postId?: string,
  ) {
    if (!brokerUserId || !clientUserId) return null;
    if (brokerUserId === clientUserId) return null;
    const filter: Record<string, unknown> = {
      broker_user_id: brokerUserId,
      client_user_id: clientUserId,
    };
    if (postId) filter.post_id = postId;
    else filter.post_id = { $exists: false };
    const existing = await this.leadModel.findOne(filter).exec();
    if (existing) return existing;
    const lead = await this.leadModel.create({
      broker_user_id: brokerUserId,
      client_user_id: clientUserId,
      post_id: postId,
    });
    this.logger.log(
      `lead_created_engagement broker=${brokerUserId} client=${clientUserId} post=${postId ?? '-'}`,
    );
    return lead;
  }

  async listForUser(userId: string) {
    const items = await this.leadModel
      .find({ $or: [{ broker_user_id: userId }, { client_user_id: userId }] })
      .sort({ createdAt: -1 })
      .exec();
    return { data: items };
  }

  async listAll() {
    const items = await this.leadModel.find().sort({ createdAt: -1 }).exec();
    return { data: items };
  }

  async updateStatus(userId: string, id: string, dto: UpdateLeadStatusDto) {
    const lead = await this.leadModel
      .findOne({
        _id: id,
        $or: [{ broker_user_id: userId }, { client_user_id: userId }],
      })
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    lead.status = dto.status;
    await lead.save();
    return { data: lead };
  }
}
