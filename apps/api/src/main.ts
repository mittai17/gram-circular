import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('GRAM-CIRCULAR API')
    .setDescription('Rural MLP Waste Management System')
    .setVersion('1.0')
    .addTag('villages')
    .addTag('batches')
    .addTag('bins')
    .addTag('vehicles')
    .addTag('routes')
    .addTag('storage')
    .addTag('dispatch')
    .addTag('inspections')
    .addTag('processors')
    .addTag('analytics')
    .addTag('citizen')
    .addTag('sync')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`GRAM-CIRCULAR API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
