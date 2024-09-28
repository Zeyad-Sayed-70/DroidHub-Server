import { Optional } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';

export class UpdateUserDto {
  @Prop({ type: String })
  @Optional()
  username?: string;

  @Prop({ type: String })
  @Optional()
  email?: string;

  @Prop({ type: String })
  @Optional()
  avatar?: string;

  @Prop({ type: String })
  @Optional()
  banar?: string;

  @Prop({ type: String })
  @Optional()
  password?: string;

  @Prop({ type: String })
  @Optional()
  role?: string;

  @Prop({ type: [String] })
  @Optional()
  communities?: string[];

  @Prop({ type: String })
  @Optional()
  bio?: string;

  @Prop({ type: String, enum: ['robot', 'human', 'human_probably'] })
  @Optional()
  probability_being?: string;
}
