import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const setupSwagger = (
  app: INestApplication,
  configService: ConfigService,
) => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Only setup Swagger in development or if explicitly enabled
  if (nodeEnv !== 'development') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Brahmaastra Broker Social API')
    .setDescription(
      'API documentation for Brahmaastra Broker Social backend application',
    )
    .setVersion('1.0.0')
    .addServer(
      `http://localhost:${configService.get<number>('PORT', 3000)}`,
      'Development',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-auth',
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        name: 'Basic Auth',
        description: 'Enter your username and password',
        in: 'header',
      },
      'basic-auth',
    )
    .addTag('Users', 'User management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui { font-family: "Courier New", monospace; }
    `,
    customfavIcon:
      'https://raw.githubusercontent.com/nestjs/docs.nestjs.com/master/src/assets/logo-small.svg',
  });

  console.log(
    `📚 Swagger documentation available at http://localhost:${configService.get<number>('PORT', 3000)}/api/docs`,
  );
};

export const setupProductionSwagger = (
  app: INestApplication,
  configService: ConfigService,
) => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const swaggerUsername = configService.get<string>(
    'SWAGGER_USERNAME',
    'admin',
  );
  const swaggerPassword = configService.get<string>(
    'SWAGGER_PASSWORD',
    'password123',
  );

  // Only setup Swagger in production if enabled via env
  const enableSwaggerProduction =
    configService.get<string>('SWAGGER_ENABLED') === 'true';

  if (nodeEnv === 'production' && !enableSwaggerProduction) {
    return;
  }

  // Setup basic auth for production
  const auth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API"');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const [scheme, credentials] = authHeader.split(' ');

    if (scheme !== 'Basic') {
      return res.status(401).json({ message: 'Invalid authentication scheme' });
    }

    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    if (username === swaggerUsername && password === swaggerPassword) {
      return next();
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  };

  const config = new DocumentBuilder()
    .setTitle('Brahmaastra Broker Social API')
    .setDescription(
      'API documentation for Brahmaastra Broker Social backend application',
    )
    .setVersion('1.0.0')
    .addServer(
      `http://localhost:${configService.get<number>('PORT', 3000)}`,
      'Development',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-auth',
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        name: 'Basic Auth',
        description: 'Enter your username and password',
        in: 'header',
      },
      'basic-auth',
    )
    .addTag('Users', 'User management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Apply auth middleware to Swagger route
  app.use('/api/docs', auth);
  app.use('/api/docs-json', auth);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui { font-family: "Courier New", monospace; }
    `,
    customfavIcon:
      'https://raw.githubusercontent.com/nestjs/docs.nestjs.com/master/src/assets/logo-small.svg',
  });

  if (nodeEnv === 'production') {
    console.warn(
      `⚠️  Swagger documentation available (PROTECTED) at /api/docs with credentials`,
    );
  } else {
    console.log(
      `📚 Swagger documentation available at http://localhost:${configService.get<number>('PORT', 3000)}/api/docs`,
    );
  }
};
