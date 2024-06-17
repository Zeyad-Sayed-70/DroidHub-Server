import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post-schema';
import mongoose, { Model } from 'mongoose';
import { PostType } from './types/post-type';
import { CreatePostDto } from './dto/create-post-dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePostDto } from './dto/update-post-dto';
import { CreateCommentsDto } from './dto/create-comments-dto';
import { Comment } from './schema/comment-schema';
import { UpdateCommentsDto } from './dto/update-comment-dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
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

  async toggleReaction(postId: string, userId: string) {
    try {
      const post = await this.postModel.findOne({ _id: postId }).exec();

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }

      const user = await this.usersService.getUserById(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND); // 404 Not Found
      }

      if (user.reactions.like.includes(postId)) {
        // Remove the like
        user.reactions.like = user.reactions.like.filter((id) => id !== postId);
        post.reactions.like = post.reactions.like.filter((id) => id !== userId);

        await user.save();
        await post.save();

        return { post, user };
      }

      // Add a like
      user.reactions.like.push(postId);
      post.reactions.like.push(userId);

      await user.save();
      await post.save();

      return { post, user };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to toggle reaction',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createComment(createCommentsDto: CreateCommentsDto) {
    const { userId, postId, comment, replyToCommentId } = createCommentsDto;

    if (!userId || !postId || !comment) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.usersService.getUserById(userId);
      const post = await this.postModel.findOne({ _id: postId }).exec();

      if (!user || !post) {
        throw new HttpException('User or post not found', HttpStatus.NOT_FOUND);
      }

      const createdAt = new Date();

      const newComment = new this.commentModel({
        userId,
        postId,
        comment,
        replyToCommentId,
        createdAt,
      });

      await newComment.save();

      post.comments.push(newComment._id.toString());
      await post.save();

      return newComment;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to create comment',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPostComments(postId: string) {
    try {
      const post = await this.postModel
        .findOne({ _id: new mongoose.Types.ObjectId(postId) })
        .exec();

      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      const comments = await this.commentModel
        .find({ _id: { $in: post.comments } })
        .exec();

      const usersIds = comments.map((comment) => comment.userId);
      const users = await this.usersService.getUsersById(usersIds);

      const usersHash = {};
      users.forEach((user) => {
        usersHash[user._id.toString()] = user;
      });

      return { comments, usersHash };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to get post comments',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateComment(updateCommentsDto: UpdateCommentsDto, commentId: string) {
    const { comment } = updateCommentsDto;

    if (!commentId || !comment) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }

    try {
      const commentObj = await this.commentModel
        .findOne({ _id: commentId })
        .exec();

      if (!commentObj) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      commentObj.comment = comment;
      commentObj.updatedAt = new Date();
      commentObj.isEdited = true;
      await commentObj.save();

      return commentObj;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to update comment',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteComment(commentId: string) {
    try {
      const commentObj = await this.commentModel
        .findOneAndDelete({ _id: commentId })
        .exec();

      if (!commentObj) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      return commentObj;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to delete comment',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
