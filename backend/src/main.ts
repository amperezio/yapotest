import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://music-front-bucket.s3-website-us-east-1.amazonaws.com/',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
