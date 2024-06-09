import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  hashedPassword: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String, default: 'DroidHub Member' })
  role: string;

  @Prop({ type: [String] })
  communities: string[];

  @Prop({ type: String, default: "I'm interested about everything." })
  bio: string;

  @Prop({
    type: String,
    enum: ['robot', 'human', 'human_probably'],
    default: 'robot',
  })
  probability_being: string;

  @Prop({ type: Date, default: new Date() })
  since: Date; // Created user from ...
}

export const UserSchema = SchemaFactory.createForClass(User);
