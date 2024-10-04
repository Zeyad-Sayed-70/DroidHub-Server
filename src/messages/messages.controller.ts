import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('chat/:chatId')
  getChatMessages(@Param() { chatId }: { chatId: string }) {
    const usersIds = chatId.split(',');
    return this.messagesService.getChatMessages(usersIds);
  }

  @Post()
  createMessage(
    @Query('message') message: string,
    @Query('chatId') chatId: string,
  ) {
    const usersIds = chatId.split(',');
    return this.messagesService.createMessage(message, usersIds);
  }

  @Post('send')
  sendMessage(
    @Query('message') message: string,
    @Query('chatId') chatId: string,
  ) {
    const usersIds = chatId.split(',');
    return this.messagesService.sendMessage(message, usersIds);
  }

  @Post('archive/:id')
  archiveMessage(@Param() { id }: { id: string }) {
    return this.messagesService.archiveMessage(id);
  }

  @Delete('delete/:id')
  deleteMessage(@Param() { id }: { id: string }) {
    return this.messagesService.deleteMessage(id);
  }

  @Put('update/:id')
  updateMessage(@Param() id: string, @Query('message') message: string) {
    return this.messagesService.updateMessage(id, message);
  }
}
