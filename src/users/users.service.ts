import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user-dto';
import { hash } from 'bcrypt';
import { Post } from 'src/posts/schema/post-schema';
import { CreateUserByGoogleDto } from './dto/create-user-by-google-dto';
import { Options } from './types/get-users-options';

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

  async createUserByGoogle(createUserByGoogleDto: CreateUserByGoogleDto) {
    try {
      // check if user already exists
      const userExists = await this.userModel
        .findOne({
          email: createUserByGoogleDto.email,
        })
        .select({ hashPassword: false, __v: false })
        .exec();

      if (userExists) return userExists;

      // create new user
      const newUser = new this.userModel({
        ...createUserByGoogleDto,
        probability_being: 'human_probably',
      });
      return newUser.save();
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to create new user',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllUsers(options: Options) {
    try {
      const users = await this.userModel
        .find(JSON.parse(options.filters))
        .skip(parseInt(options.skip as string))
        .limit(JSON.parse(options.limit as string))
        .select({ hashedPassword: false, __v: false })
        .exec();

      if (JSON.parse(options.robotsOnly as string)) {
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

  async getUsersById(usersIds: string[]) {
    try {
      const users = await this.userModel
        .find({
          _id: {
            $in: usersIds,
          },
        })
        .select({ hashedPassword: false, __v: false })
        .exec();

      return users;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to get all users',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsersByName(name: string) {
    try {
      const users = await this.userModel
        .find({
          username: {
            $regex: name,
            $options: 'i',
          },
        })
        .select({ hashedPassword: false, __v: false })
        .exec();

      return users;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Failed to get users by name',
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

  async follow(userId: string, followId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const followObjectId = new mongoose.Types.ObjectId(followId);

      if (!mongoose.isValidObjectId(objectId)) {
        throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
      }

      if (!mongoose.isValidObjectId(followObjectId)) {
        throw new HttpException('Invalid followId', HttpStatus.BAD_REQUEST);
      }

      const user = await this.userModel
        .findById(objectId)
        .select({ hashedPassword: false, __v: false })
        .exec();

      // check if user exist
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      const followUser = await this.userModel
        .findById(followObjectId)
        .select({ hashedPassword: false, __v: false })
        .exec();

      // check if follow user exist
      if (!followUser) {
        throw new HttpException(
          'Follow user not exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.following.includes(followObjectId.toString())) {
        throw new HttpException(
          'You already follow this user',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.following.push(followObjectId.toString());
      followUser.followers.push(objectId.toString());

      await user.save();
      await followUser.save();

      return user;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unfollow(userId: string, unfollowId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const unfollowObjectId = new mongoose.Types.ObjectId(unfollowId);

      if (!mongoose.isValidObjectId(objectId)) {
        throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
      }

      if (!mongoose.isValidObjectId(unfollowObjectId)) {
        throw new HttpException('Invalid unfollowId', HttpStatus.BAD_REQUEST);
      }

      const user = await this.userModel
        .findById(objectId)
        .select({ hashedPassword: false, __v: false })
        .exec();

      // check if user exist
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }

      const unfollowUser = await this.userModel
        .findById(unfollowObjectId)
        .select({ hashedPassword: false, __v: false })
        .exec();

      // check if unfollow user exist
      if (!unfollowUser) {
        throw new HttpException(
          'Unfollow user not exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user.following.includes(unfollowObjectId.toString())) {
        throw new HttpException(
          'You already unfollow this user',
          HttpStatus.BAD_REQUEST,
        );
      }

      const index = user.following.indexOf(unfollowObjectId.toString());
      user.following.splice(index, 1);
      const unfollowIndex = unfollowUser.followers.indexOf(objectId.toString());
      unfollowUser.followers.splice(unfollowIndex, 1);

      await user.save();
      await unfollowUser.save();

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
