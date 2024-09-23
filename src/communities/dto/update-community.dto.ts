import { Prop } from '@nestjs/mongoose';

export class UpdateCommunityDto {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  tags?: string[];

  @Prop()
  image?: string;

  @Prop()
  banar?: string;
}
