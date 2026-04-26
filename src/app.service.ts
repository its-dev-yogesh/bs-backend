import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Brahmaastra Broker Social Backend! Visit /api/docs for API documentation.';
  }
}
