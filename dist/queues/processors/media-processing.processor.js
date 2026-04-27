"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MediaProcessingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaProcessingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const queue_constants_1 = require("../queue.constants");
let MediaProcessingProcessor = MediaProcessingProcessor_1 = class MediaProcessingProcessor extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(MediaProcessingProcessor_1.name);
    process(job) {
        if (job.name !== queue_constants_1.JOB_PROCESS_MEDIA) {
            return Promise.resolve({ ok: false });
        }
        const { media_id, post_id, url, type } = job.data;
        this.logger.log(`Processing ${type} media ${media_id} for post ${post_id}: ${url}`);
        return Promise.resolve({ ok: true });
    }
};
exports.MediaProcessingProcessor = MediaProcessingProcessor;
exports.MediaProcessingProcessor = MediaProcessingProcessor = MediaProcessingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUE_MEDIA_PROCESSING)
], MediaProcessingProcessor);
//# sourceMappingURL=media-processing.processor.js.map