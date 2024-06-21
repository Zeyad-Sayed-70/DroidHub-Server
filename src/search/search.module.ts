import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PostsModule, UsersModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
