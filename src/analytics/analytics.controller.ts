import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  @Get('dashboard')
  dashboard() {
    return {
      data: {
        dau: 0,
        listingsCount: 0,
        leadVolume: 0,
        brokerConversationStarts: 0,
      },
      featureFlag: 'phase2',
    };
  }
}
