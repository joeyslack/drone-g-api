import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as jsonServer from 'json-server';
// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Gather API Documentation')
    .setDescription('Documentation of available routes/services/providers in client specific gather api.')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // app.use(middlewares);
  // app.use(router);

  await app.listen(parseInt(process.env.PORT) || 3000, process.env.SERVER_URL || '0.0.0.0');
}

bootstrap();
