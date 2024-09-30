import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Endpoint to create a new notification
  @Post()
  async createNotification(
    @Body() createNotificationDto: { message: string; userId: string },
  ): Promise<Notification> {
    return this.notificationsService.createNotification(
      createNotificationDto.message,
      createNotificationDto.userId,
    );
  }

  // Endpoint to retrieve notifications for a specific user
  @Get(':userId')
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('tab') tab: string,
  ): Promise<Notification[]> {
    return this.notificationsService.getNotificationsByUser(userId, tab);
  }

  // Endpoint to archive a specific notification
  @Get('archive/:id')
  async archiveNotification(@Param('id') id: string): Promise<void> {
    return this.notificationsService.archiveNotification(id);
  }

  // Endpoint to send a notification to a specific user
  @Post('send')
  async sendNotification(
    @Body() sendNotificationDto: { message: string; userId: string },
  ): Promise<void> {
    return this.notificationsService.sendNotification(sendNotificationDto);
  }
}
