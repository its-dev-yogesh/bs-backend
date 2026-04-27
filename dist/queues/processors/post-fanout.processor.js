"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PostFanoutProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFanoutProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const queue_constants_1 = require("../queue.constants");
const feed_schema_1 = require("../../feeds/schemas/feed.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
let PostFanoutProcessor = PostFanoutProcessor_1 = class PostFanoutProcessor extends bullmq_1.WorkerHost {
    feedModel;
    userModel;
    logger = new common_1.Logger(PostFanoutProcessor_1.name);
    constructor(feedModel, userModel) {
        super();
        this.feedModel = feedModel;
        this.userModel = userModel;
    }
    async process(job) {
        if (job.name !== queue_constants_1.JOB_FANOUT_POST) {
            return { inserted: 0 };
        }
        const { post_id, author_user_id, post_type } = job.data;
        const counterpartyType = post_type === 'listing' ? user_schema_1.UserType.USER : user_schema_1.UserType.AGENT;
        const targetUsers = await this.userModel
            .find({ type: counterpartyType, _id: { $ne: author_user_id } })
            .select({ _id: 1 })
            .lean()
            .exec();
        if (targetUsers.length === 0) {
            this.logger.log(`No counterparty users for post ${post_id}`);
            return { inserted: 0 };
        }
        const ops = targetUsers.map((u) => ({
            updateOne: {
                filter: { user_id: u._id, post_id },
                update: { $setOnInsert: { user_id: u._id, post_id, score: 0 } },
                upsert: true,
            },
        }));
        const result = await this.feedModel.bulkWrite(ops, { ordered: false });
        const inserted = (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0);
        this.logger.log(`Fanned out post ${post_id} to ${targetUsers.length} ${counterpartyType}s (${inserted} entries)`);
        return { inserted };
    }
};
exports.PostFanoutProcessor = PostFanoutProcessor;
exports.PostFanoutProcessor = PostFanoutProcessor = PostFanoutProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUE_POST_FANOUT),
    __param(0, (0, mongoose_1.InjectModel)(feed_schema_1.Feed.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PostFanoutProcessor);
//# sourceMappingURL=post-fanout.processor.js.map