import { Module } from '@nestjs/common';
import { PosterService } from './poster.service';
import { PosterController } from './poster.controller';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
  providers: [PosterService],
  controllers: [PosterController],
})
export class PosterModule {}
