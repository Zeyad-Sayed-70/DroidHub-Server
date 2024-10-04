import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: [String], required: true })
  usersIds: string[];

  @Prop({ type: String, required: true })
  creatorId: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;

  @Prop({ type: Boolean, default: false })
  isArchived: boolean;

  @Prop({ type: Boolean, default: false })
  seen: boolean;

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop({ type: String })
  replyToMessageId?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
