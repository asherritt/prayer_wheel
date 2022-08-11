import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// TODO handle exceptions
// TODO create query that returns random prayer ?How to weight?
// TODO lookup table to track what prayers people have prayed for?
// TODO scoring for consistency?
// TODO Unit Tests
// TODO validate all calls ?Global?
// TODO Implement logging
// TODO env vars and secrets?
// TODO think about admin api?
