import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query('limit') limit: number, @Query('skip') skip: number) {
    return this.postsService.getAllPosts(limit, skip);
  }

  @Get(':postId')
  getPostById(@Param() postId: string) {
    return this.postsService.getPost(postId);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Put(':postId')
  updatePostById(@Param() postId: string, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(postId, body);
  }

  @Delete(':postId')
  deletePostById(@Param() postId: string) {
    return this.postsService.deletePost(postId);
  }
}
