"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProductionSwagger = exports.setupSwagger = void 0;
const swagger_1 = require("@nestjs/swagger");
const setupSwagger = (app, configService) => {
    const nodeEnv = configService.get('NODE_ENV', 'development');
    if (nodeEnv !== 'development') {
        return;
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Brahmaastra Broker Social API')
        .setDescription('API documentation for Brahmaastra Broker Social backend application')
        .setVersion('1.0.0')
        .addServer(`http://localhost:${configService.get('PORT', 3000)}`, 'Development')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'jwt-auth')
        .addBasicAuth({
        type: 'http',
        scheme: 'basic',
        name: 'Basic Auth',
        description: 'Enter your username and password',
        in: 'header',
    }, 'basic-auth')
        .addTag('Users', 'User management endpoints')
        .addTag('Health', 'Health check endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
        customfavIcon: 'https://raw.githubusercontent.com/nestjs/docs.nestjs.com/master/src/assets/logo-small.svg',
    });
    console.log(`📚 Swagger documentation available at http://localhost:${configService.get('PORT', 3000)}/api/docs`);
};
exports.setupSwagger = setupSwagger;
const setupProductionSwagger = (app, configService) => {
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const swaggerUsername = configService.get('SWAGGER_USERNAME', 'admin');
    const swaggerPassword = configService.get('SWAGGER_PASSWORD', 'password123');
    const enableSwaggerProduction = configService.get('SWAGGER_ENABLED') === 'true';
    if (nodeEnv === 'production' && !enableSwaggerProduction) {
        return;
    }
    const auth = (req, res, next) => {
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
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Brahmaastra Broker Social API')
        .setDescription('API documentation for Brahmaastra Broker Social backend application')
        .setVersion('1.0.0')
        .addServer(`http://localhost:${configService.get('PORT', 3000)}`, 'Development')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'jwt-auth')
        .addBasicAuth({
        type: 'http',
        scheme: 'basic',
        name: 'Basic Auth',
        description: 'Enter your username and password',
        in: 'header',
    }, 'basic-auth')
        .addTag('Users', 'User management endpoints')
        .addTag('Health', 'Health check endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    app.use('/api/docs', auth);
    app.use('/api/docs-json', auth);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
        customfavIcon: 'https://raw.githubusercontent.com/nestjs/docs.nestjs.com/master/src/assets/logo-small.svg',
    });
    if (nodeEnv === 'production') {
        console.warn(`⚠️  Swagger documentation available (PROTECTED) at /api/docs with credentials`);
    }
    else {
        console.log(`📚 Swagger documentation available at http://localhost:${configService.get('PORT', 3000)}/api/docs`);
    }
};
exports.setupProductionSwagger = setupProductionSwagger;
//# sourceMappingURL=swagger.config.js.map