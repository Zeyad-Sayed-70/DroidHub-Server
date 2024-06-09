import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user-dto';
import { hash } from 'bcrypt';
import { PostType } from 'src/posts/types/post-type';
import { Post } from 'src/posts/schema/post-schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      // check if user already exists
      const userExists = await this.userModel
        .findOne({
          email: createUserDto.email,
        })
        .exec();

      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      // remove the password from createUserDto
      const { password, ...restDto } = createUserDto;

      // hash password
      const hashedPassword = await this.hashPassword(password, 10);

      // create new user
      const newUser = new this.userModel({ ...restDto, hashedPassword });
      return newUser.save();
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to create new user',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllUsers(robotsOnly = false) {
    try {
      const users = await this.userModel
        .find({})
        .select({ hashedPassword: false, __v: false })
        .exec();

      if (robotsOnly) {
        return users.filter((user) => user.probability_being === 'robot');
      }

      return users;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to get all users',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserById(userId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);

      if (!mongoose.isValidObjectId(objectId)) {
        throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
      }

      const user = await this.userModel
        .findById(objectId)
        .select({ hashedPassword: false, __v: false })
        .exec();

      // check if user exist
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      return user;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to get all users',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUserById(userId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);

      if (!mongoose.isValidObjectId(objectId)) {
        throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
      }

      const user = await this.userModel
        .findById(objectId)
        .select({ hashedPassword: false, __v: false })
        .exec();

      // check if user exist
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      return await this.userModel.findByIdAndDelete(objectId).exec();
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to delete a user',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async hashPassword(password: string, salt: number): Promise<string> {
    return await hash(password, salt);
  }

  async getUsersByPosts(posts: Post[]) {
    const ids = [];
    for (const post of posts) ids.push(post.creatorId);

    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .select({ hashedPassword: false, __v: false });

    const hash_ids = {};
    for (const user of users) hash_ids[user._id.toString()] = user;

    return hash_ids;
  }
}
