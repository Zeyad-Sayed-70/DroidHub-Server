import { Prop } from '@nestjs/mongoose';

export class CreateUserDto {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  role?: string;

  @Prop({ type: [String] })
  communities?: string[];

  @Prop({ type: String })
  bio?: string;

  @Prop({ type: String, enum: ['robot', 'human', 'human_probably'] })
  probability_being?: string;
}
