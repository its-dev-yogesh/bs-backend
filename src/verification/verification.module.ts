import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { KycRequest, KycRequestSchema } from './schemas/kyc-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KycRequest.name, schema: KycRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
