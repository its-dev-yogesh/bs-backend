"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PhoneOtpProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneOtpProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const queue_constants_1 = require("../queue.constants");
let PhoneOtpProcessor = PhoneOtpProcessor_1 = class PhoneOtpProcessor extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(PhoneOtpProcessor_1.name);
    process(job) {
        if (job.name !== queue_constants_1.JOB_SEND_OTP_SMS) {
            return Promise.resolve({ delivered: false });
        }
        const { phone, otp_code, otp_type } = job.data;
        this.logger.log(`[OTP:${otp_type}] -> ${phone}: ${otp_code}`);
        return Promise.resolve({ delivered: true });
    }
};
exports.PhoneOtpProcessor = PhoneOtpProcessor;
exports.PhoneOtpProcessor = PhoneOtpProcessor = PhoneOtpProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.QUEUE_PHONE_OTP)
], PhoneOtpProcessor);
//# sourceMappingURL=phone-otp.processor.js.map