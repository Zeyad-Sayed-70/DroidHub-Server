import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { SendNotificationDto } from './send-notification.dto';
import { AppGateway } from '../app.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
    @Inject(forwardRef(() => AppGateway))
    private appGateway: AppGateway,
  ) {}

  async sendNotification(sendNotificationDto: SendNotificationDto) {
    const { message, userId } = sendNotificationDto;
    // Emit the notification to the specific user via WebSocket
    this.appGateway.handleSendNotification(null, { message, userId });
  }

  async createNotification(message: string, userId: string) {
    const notification = new this.notificationModel({ message, userId });
    await notification.save();
    return notification;
  }

  async getNotificationsByUser(userId: string, tab: string) {
    if (tab === 'archive') {
      const notifications = await this.notificationModel
        .find({ userId, isArchived: true })
        .sort({ timestamp: -1 })
        .exec();
      return notifications;
    }

    if (tab === 'seen') {
      const notifications = await this.notificationModel
        .find({ userId, seen: true, isArchived: false })
        .sort({ timestamp: -1 })
        .exec();
      return notifications;
    }

    const notifications = await this.notificationModel
      .find({ userId, seen: false, isArchived: false })
      .sort({ timestamp: -1 })
      .exec();

    // make the notifications seen
    await this.notificationModel
      .updateMany({ userId, seen: false, isArchived: false }, { seen: true })
      .exec();

    return notifications;
  }

  async archiveNotification(id: string) {
    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      throw new Error('Notification not found');
    }

    // toggle the isArchived field
    notification.isArchived = !notification.isArchived;
    await notification.save();
  }
}
