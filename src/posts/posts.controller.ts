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
import { ToggleReactionDto } from './dto/toggle-reaction-dto';
import { CreateCommentsDto } from './dto/create-comments-dto';
import { UpdateCommentsDto } from './dto/update-comment-dto';

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
  updatePostById(
    @Param() { postId }: { postId: string },
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, body);
  }

  @Delete(':postId')
  deletePostById(@Param() { postId }: { postId: string }) {
    return this.postsService.deletePost(postId);
  }

  @Post('/reaction')
  toggleReaction(@Body() toggleReactionDto: ToggleReactionDto) {
    return this.postsService.toggleReaction(
      toggleReactionDto.postId,
      toggleReactionDto.userId,
    );
  }

  @Post('/comments')
  createComment(@Body() createCommentsDto: CreateCommentsDto) {
    return this.postsService.createComment(createCommentsDto);
  }

  @Get('/comments/:postId')
  getPostComments(@Param() { postId }: { postId: string }) {
    return this.postsService.getPostComments(postId);
  }

  @Put('/comments/:commentId')
  updateComment(
    @Body() updateCommentsDto: UpdateCommentsDto,
    @Param() { commentId }: { commentId: string },
  ) {
    return this.postsService.updateComment(updateCommentsDto, commentId);
  }

  @Delete('/comments/:commentId')
  deleteComment(@Param() { commentId }: { commentId: string }) {
    return this.postsService.deleteComment(commentId);
  }
}
