import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // Body parsing
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // API prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('EduMaster Africa API')
    .setDescription('Comprehensive Educational Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & User Management')
    .addTag('courses', 'Course & Learning Management')
    .addTag('questions', 'Question Bank')
    .addTag('cbt', 'Computer Based Testing')
    .addTag('analytics', 'Analytics & Progress')
    .addTag('ai', 'AI Tutor & Features')
    .addTag('notifications', 'Notifications')
    .addTag('payments', 'Payments & Subscriptions')
    .build();
  // Swagger docs (disabled for now due to @nestjs/swagger v7 compatibility issue with NestJS v10)
  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    logger.log('📄 Swagger docs available');
  } catch (e) {
    logger.warn('Swagger setup skipped: ' + (e as Error).message);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
}
bootstrap();