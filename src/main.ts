import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  });
  await app.listen(5000);
}
bootstrap();
