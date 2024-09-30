import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Boolean, default: false })
  seen: boolean;

  @Prop({ type: Boolean, default: false })
  isArchived: boolean;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
