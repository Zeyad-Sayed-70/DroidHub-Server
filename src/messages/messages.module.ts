import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { AppGateway } from 'src/app.gateway';
import { AppModule } from 'src/app.module';
import { NotificationsModule } from 'src/notifications/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
        collection: 'messages',
      },
    ]),
    forwardRef(() => AppModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, { provide: AppGateway, useClass: AppGateway }],
  exports: [MessagesService],
})
export class MessagesModule {}
