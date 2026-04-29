import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupProductionSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Setup Swagger with production authentication
  setupProductionSwagger(app, configService);

  const port = configService.get<number>('PORT', 3004);
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
void bootstrap();
