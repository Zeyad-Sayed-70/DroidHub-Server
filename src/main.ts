import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PosterService } from './poster/poster.service';

export const FRONTEND_URL = 'http://localhost:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: FRONTEND_URL, // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers)
  });

  // Start Poster
  // const sequencerService = app.get(PosterService);
  // sequencerService.startPoster();

  await app.listen(3001);
}
bootstrap();
