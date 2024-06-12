import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { CreateUserByGoogleDto } from './dto/create-user-by-google-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
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
}
