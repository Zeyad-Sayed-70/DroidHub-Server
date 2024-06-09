import { Prop } from '@nestjs/mongoose';

export class CreatePostDto {
  @Prop({ type: String, required: true })
  creatorId: string;

  @Prop({
    type: String,
    enum: ['general', 'text', 'image', 'video'],
    default: 'general',
  })
  type: string;

  @Prop({ type: String })
  content?: string;

  @Prop({ type: [String] })
  sources?: string[];

  @Prop({ type: String })
  caption?: string;
}
