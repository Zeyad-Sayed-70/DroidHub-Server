import { Prop } from '@nestjs/mongoose';

export class CreateCommunityDto {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image?: string;
}
