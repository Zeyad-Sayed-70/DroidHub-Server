import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Reactions } from 'src/posts/types/post-type';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
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

  @Prop({
    type: {
      like: { type: [String], default: [] },
    },
    default: {
      like: [],
    },
  })
  reactions: Reactions;
}

export const UserSchema = SchemaFactory.createForClass(User);
