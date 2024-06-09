import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Reactions } from '../types/post-type';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  creatorId: string;

  @Prop({
    type: String,
    enum: ['general', 'text', 'image', 'video'],
    required: true,
  })
  type: string;

  @Prop({
    type: String,
    required: function () {
      this.type === 'text';
    },
  })
  content: string;

  @Prop({
    type: [String],
    required: function () {
      ['image'].includes(this.type);
    },
  })
  images: [string];

  @Prop({
    type: [String],
    required: function () {
      ['video'].includes(this.type);
    },
  })
  videos: [string];

  @Prop({
    type: String,
  })
  caption: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  resources: string[];

  @Prop({
    type: {
      like: { type: Number, default: 0, min: 0 },
      comments: { type: Number, default: 0, min: 0 },
    },
    default: {
      like: 0,
      comments: 0,
    },
  })
  reactions: Reactions;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.pre('save', function (next) {
  if (this.type === 'text') {
    this.images = undefined;
    this.videos = undefined;
    this.caption = undefined;
  }
  next();
});
