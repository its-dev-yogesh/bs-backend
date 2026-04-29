export const QUEUE_POST_FANOUT = 'post-fanout';
export const QUEUE_MEDIA_PROCESSING = 'media-processing';
export const QUEUE_PHONE_OTP = 'phone-otp';

export const JOB_FANOUT_POST = 'fanout-post';
export const JOB_PROCESS_MEDIA = 'process-media';
export const JOB_SEND_OTP_SMS = 'send-otp-sms';

export interface FanoutPostJobData {
  post_id: string;
  author_user_id: string;
  post_type: 'listing' | 'requirement';
}

export interface ProcessMediaJobData {
  media_id: string;
  post_id: string;
  url: string;
  type: 'image' | 'video' | 'document';
}

export interface SendOtpSmsJobData {
  phone: string;
  otp_code: string;
  otp_type: string;
}
