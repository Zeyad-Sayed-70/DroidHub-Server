import mongoose from 'mongoose';

export type Reactions = {
  like?: string[];
  comments?: string[];
};

export type PostType = {
  _id?: mongoose.Types.ObjectId;
  __v?: number;
  creatorId: string;
  type: string; // 'text' | 'image' | 'video'
  content?: string;
  sources?: string[];
  caption?: string;
  createdAt: Date;
  reactions: Reactions;
};
