import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  JOB_SEND_OTP_SMS,
  QUEUE_PHONE_OTP,
  SendOtpSmsJobData,
} from '../queue.constants';

@Processor(QUEUE_PHONE_OTP)
export class PhoneOtpProcessor extends WorkerHost {
  private readonly logger = new Logger(PhoneOtpProcessor.name);

  process(job: Job<SendOtpSmsJobData>): Promise<{ delivered: boolean }> {
    if (job.name !== JOB_SEND_OTP_SMS) {
      return Promise.resolve({ delivered: false });
    }

    /*
     * Brevo SMS integration goes here. Until then we log the OTP so flows
     * remain testable. Note the OTP is hardcoded to 123456 in OtpService.
     */
    const { phone, otp_code, otp_type } = job.data;
    this.logger.log(`[OTP:${otp_type}] -> ${phone}: ${otp_code}`);
    return Promise.resolve({ delivered: true });
  }
}
