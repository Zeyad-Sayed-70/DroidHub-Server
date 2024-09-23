import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommunityDocument = HydratedDocument<Community>;

@Schema()
export class Community {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: [String], default: [] })
  members: string[];

  @Prop({ type: [String], default: [] })
  admins: string[];

  @Prop({ type: [String], default: [] })
  moderators: string[];

  @Prop({ type: String })
  banar: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
