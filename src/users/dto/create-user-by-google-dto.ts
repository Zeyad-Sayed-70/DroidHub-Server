import { Prop } from '@nestjs/mongoose';

export class CreateUserByGoogleDto {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  avatar: string;
}
