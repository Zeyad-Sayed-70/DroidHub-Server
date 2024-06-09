import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post-schema';
import { Model } from 'mongoose';
import { PostType } from './types/post-type';
import { CreatePostDto } from './dto/create-post-dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from './dto/update-post-dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(post: CreatePostDto) {
    try {
      const newPost = new this.postModel(post);
      console.log(newPost);
      return newPost.save();
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to create new post',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPosts(limit = 10, skip = 0) {
    try {
      const posts = await this.postModel
        .find({})
        .limit(limit)
        .skip(skip)
        .exec();

      if (!posts) {
        throw new HttpException('Posts not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }

      // Fetch all users in hash map structure
      const users = await this.usersService.getUsersByPosts(posts);

      return { posts, users };
    } catch (error) {
      console.log(error);
    }
  }

  async getPost(postId: string): Promise<PostType> {
    try {
      const post = this.postModel.findOne({ _id: postId }).exec();

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }

      return post;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to get a post',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePost(postId: string, post: UpdatePostDto) {
    try {
      const updatedPost = await this.postModel
        .findOneAndUpdate({ _id: postId }, post, { new: true })
        .exec();

      if (!updatedPost) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }

      return updatedPost;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to update a post',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deletePost(postId: string) {
    try {
      const deletedPost = await this.postModel
        .findOneAndDelete({ _id: postId })
        .exec();

      if (!deletedPost) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }

      return deletedPost;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to delete a post',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
