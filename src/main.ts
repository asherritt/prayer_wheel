import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// TODO handle exceptions
// TODO lookup table to track what prayers people have prayed for?
// TODO scoring for consistency?
// TODO Unit Tests
// TODO validate all calls ?Global?
// TODO env vars and secrets?
// TODO think about admin api?
// TODO how to contact people once the time period is done.
// TODO report prayer functionality
// TODO AWS check prayer language for violations
// TODO Approve Reject prayers
