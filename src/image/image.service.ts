import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Image, ImageDocument } from './schema/image.schema';

export interface ImageWithId extends Image {
  _id: mongoose.Types.ObjectId;
}

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<ImageWithId> {
    const newImage = new this.imageModel({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
    });
    return newImage.save();
  }

  async getImage(imageId: string): Promise<Image> {
    return this.imageModel.findById(imageId).exec();
  }
}
