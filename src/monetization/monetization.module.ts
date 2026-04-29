import { Module } from '@nestjs/common';
import { MonetizationController } from './monetization.controller';

@Module({
  controllers: [MonetizationController],
})
export class MonetizationModule {}
