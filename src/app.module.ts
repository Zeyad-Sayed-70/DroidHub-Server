import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PosterModule } from './poster/poster.module';
import { SearchService } from './search/search.service';
import { SearchController } from './search/search.controller';
import { SearchModule } from './search/search.module';
import { CommunitiesModule } from './communities/communities.module';
import { ImageModule } from './image/image.module';
import { NotificationsModule } from './notifications/notification.module';
import { AppGateway } from './app.gateway';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    PostsModule,
    UsersModule,
    PosterModule,
    SearchModule,
    CommunitiesModule,
    ImageModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => MessagesModule),
  ],
  controllers: [AppController, SearchController],
  providers: [AppService, SearchService, AppGateway],
  exports: [AppGateway],
})
export class AppModule {}
