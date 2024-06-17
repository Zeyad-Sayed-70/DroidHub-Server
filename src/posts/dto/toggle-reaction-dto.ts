import { Prop } from '@nestjs/mongoose';

export class ToggleReactionDto {
  @Prop({ type: String })
  postId?: string;

  @Prop({ type: String })
  userId?: string;
}
