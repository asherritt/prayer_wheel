import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// TODO validate all calls
// TODO make use of uid on jwt and auth
// TODO handle exceptions
// TODO create query that returns random prayer
// TODO Unit Tests
