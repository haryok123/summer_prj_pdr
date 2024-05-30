import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(19429);

  app.use('/public', express.static(join(__dirname, '..', 'public')));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views/pages'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', '/views/templates'));
  hbs.registerHelper('ifEquals', function (arg1: any, arg2: any, options: any) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper('hexToBase64', function (hexString: any) {
    if (!hexString) return '';
    return Buffer.from(hexString, 'binary').toString('base64');
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

bootstrap();
