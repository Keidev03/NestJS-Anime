import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorMiddleware } from './middleware/error.middleware';

async function Bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorMiddleware());
  await app.listen(3000);
}
Bootstrap();
