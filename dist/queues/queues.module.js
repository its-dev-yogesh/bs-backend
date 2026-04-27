"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuesModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const queue_config_1 = require("../config/queue.config");
const queue_constants_1 = require("./queue.constants");
const feed_schema_1 = require("../feeds/schemas/feed.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const post_fanout_processor_1 = require("./processors/post-fanout.processor");
const media_processing_processor_1 = require("./processors/media-processing.processor");
const phone_otp_processor_1 = require("./processors/phone-otp.processor");
let QueuesModule = class QueuesModule {
};
exports.QueuesModule = QueuesModule;
exports.QueuesModule = QueuesModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: queue_config_1.bullmqConnection,
            }),
            bullmq_1.BullModule.registerQueue({ name: queue_constants_1.QUEUE_POST_FANOUT }, { name: queue_constants_1.QUEUE_MEDIA_PROCESSING }, { name: queue_constants_1.QUEUE_PHONE_OTP }),
            mongoose_1.MongooseModule.forFeature([
                { name: feed_schema_1.Feed.name, schema: feed_schema_1.FeedSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        providers: [post_fanout_processor_1.PostFanoutProcessor, media_processing_processor_1.MediaProcessingProcessor, phone_otp_processor_1.PhoneOtpProcessor],
        exports: [bullmq_1.BullModule],
    })
], QueuesModule);
//# sourceMappingURL=queues.module.js.map