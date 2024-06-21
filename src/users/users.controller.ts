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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { CreateUserByGoogleDto } from './dto/create-user-by-google-dto';
import { Options } from './types/get-users-options';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(@Query() options: Options) {
    return this.usersService.getAllUsers(options);
  }

  @Get(':userId')
  getUserById(@Param() { userId }: { userId: string }) {
    return this.usersService.getUserById(userId);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('by/google')
  createUserByGoogle(@Body() createUserByGoogleDto: CreateUserByGoogleDto) {
    return this.usersService.createUserByGoogle(createUserByGoogleDto);
  }

  @Put(':userId')
  updateUserById(@Param() userId: string, @Body() body: UpdateUserDto) {
    return `user updated`;
  }

  @Delete(':userId')
  deleteUserById(@Param() { userId }: { userId: string }) {
    return this.usersService.deleteUserById(userId);
  }

  @Post(':userId/follow/:followId')
  followUserById(
    @Param() { userId, followId }: { userId: string; followId: string },
  ) {
    return this.usersService.follow(userId, followId);
  }

  @Post(':userId/unfollow/:unfollowId')
  unfollowUserById(
    @Param() { userId, unfollowId }: { userId: string; unfollowId: string },
  ) {
    return this.usersService.unfollow(userId, unfollowId);
  }
}
