import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostStatus, PostType } from '../posts/schemas/post.schema';
import { PropertyListing } from '../posts/schemas/property-listing.schema';
import { PropertyRequirement } from '../posts/schemas/property-requirement.schema';

const BHOPAL_LOCALITIES = [
  'MP Nagar',
  'Arera Colony',
  'Kolar Road',
  'Shahpura',
  'Bairagarh',
];

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PropertyListing.name)
    private readonly listingModel: Model<PropertyListing>,
    @InjectModel(PropertyRequirement.name)
    private readonly requirementModel: Model<PropertyRequirement>,
  ) {}

  async search(params: Record<string, string | undefined>) {
    const {
      q,
      type,
      location,
      minPrice,
      maxPrice,
      bhk,
      limit = '20',
      skip = '0',
    } = params;

    const base: Record<string, unknown> = { status: PostStatus.ACTIVE };
    if (type === 'listing' || type === 'requirement') {
      base.type = type as PostType;
    }
    if (q) {
      base.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (location) {
      base.location_text = { $regex: location, $options: 'i' };
    }

    const posts = await this.postModel
      .find(base)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .exec();

    const postIds = posts.map((p) => p._id).filter(Boolean) as string[];
    const [listings, requirements] = await Promise.all([
      this.listingModel.find({ post_id: { $in: postIds } }).exec(),
      this.requirementModel.find({ post_id: { $in: postIds } }).exec(),
    ]);
    const listingMap = new Map(listings.map((l) => [l.post_id, l]));
    const requirementMap = new Map(requirements.map((r) => [r.post_id, r]));

    let items = posts.filter((p) => {
      const listing = listingMap.get(p._id ?? '');
      if (listing) {
        if (minPrice && listing.price < Number(minPrice)) return false;
        if (maxPrice && listing.price > Number(maxPrice)) return false;
        if (bhk && listing.bhk !== Number(bhk)) return false;
      }
      return true;
    });

    items = items.sort((a, b) => {
      const aBhopal = BHOPAL_LOCALITIES.some((loc) =>
        (a.location_text ?? '').toLowerCase().includes(loc.toLowerCase()),
      );
      const bBhopal = BHOPAL_LOCALITIES.some((loc) =>
        (b.location_text ?? '').toLowerCase().includes(loc.toLowerCase()),
      );
      return Number(bBhopal) - Number(aBhopal);
    });

    return {
      data: items.map((p) => ({
        ...p,
        listing: listingMap.get(p._id ?? '') ?? null,
        requirement: requirementMap.get(p._id ?? '') ?? null,
      })),
    };
  }
}
