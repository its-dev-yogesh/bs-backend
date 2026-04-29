import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Monetization')
@Controller('monetization')
export class MonetizationController {
  @Get('plans')
  plans() {
    return {
      data: [
        {
          id: 'broker-basic',
          name: 'Broker Basic',
          priceMonthly: 0,
          featureFlag: 'phase2',
        },
        {
          id: 'broker-pro',
          name: 'Broker Pro',
          priceMonthly: 1999,
          featureFlag: 'phase2',
        },
      ],
    };
  }
}
