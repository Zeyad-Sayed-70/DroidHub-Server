import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const image = await this.imageService.uploadImage(file);
    return { url: `/images/${image._id.toString()}` };
  }

  @Get(':id')
  async getImage(@Param('id') imageId: string, @Res() res: Response) {
    const image = await this.imageService.getImage(imageId);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    res.setHeader('Content-Type', image.mimetype);
    res.send(image.data);
  }
}
