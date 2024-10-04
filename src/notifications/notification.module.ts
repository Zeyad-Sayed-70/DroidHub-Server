import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationSchema } from './notification.schema';
import { AppGateway } from '../app.gateway';
import { AppModule } from 'src/app.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    forwardRef(() => AppModule),
    forwardRef(() => MessagesModule),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    { provide: AppGateway, useClass: AppGateway },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
