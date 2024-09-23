import { Prop } from '@nestjs/mongoose';

export class CreateCommunityDto {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];

  @Prop()
  image?: string;
}
