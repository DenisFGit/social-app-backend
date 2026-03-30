import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { seedAdmin } from './seeds/admin.seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Museum example')
    .setDescription('The museum API description')
    .setVersion('1.0')
    .addTag('Museum')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);

  const dataSource = app.get<DataSource>(DataSource);
  await seedAdmin(dataSource);

}
bootstrap();
