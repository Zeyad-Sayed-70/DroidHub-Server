import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PosterService } from './poster/poster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Start Poster
  // const sequencerService = app.get(PosterService);
  // sequencerService.startPoster();

  await app.listen(3001);
}
bootstrap();
