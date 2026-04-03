import 'dotenv/config'; // add this as very first line
import { v2 as cloudinary } from 'cloudinary';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { seedAdmin } from './seeds/admin.seed';
import { DataSource } from 'typeorm';
// import { configureCloudinary } from './cloudinary/cloudinary.config';

async function bootstrap() {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://social-app-frontend-ebon.vercel.app/'],
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

  // console.log('ENV TEST:', process.env.CLOUDINARY_API_KEY);


  await app.listen(process.env.PORT ?? 3000);


  const dataSource = app.get<DataSource>(DataSource);
  await seedAdmin(dataSource);

}
bootstrap();
