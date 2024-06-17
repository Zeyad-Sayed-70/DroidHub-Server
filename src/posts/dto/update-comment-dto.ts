import { Prop } from '@nestjs/mongoose';

export class UpdateCommentsDto {
  @Prop({ type: String })
  comment: string;
}
