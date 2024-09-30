// src/notifications/dto/send-notification.dto.ts

import { Prop } from '@nestjs/mongoose';

export class SendNotificationDto {
  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  userId: string; // The ID of the user to whom the notification will be sent
}
