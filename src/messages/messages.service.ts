import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schema';
import { Model } from 'mongoose';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @Inject(forwardRef(() => AppGateway))
    private appGateway: AppGateway,
  ) {}

  async getChatMessages(usersIds: string[]) {
    const messages = await this.messageModel
      .find({ usersIds })
      .sort({ timestamp: 1 });
    return messages;
  }

  async getMessagesByUserId(userId: string) {
    try {
      // Find messages where the userId is in the usersIds array, sorted by timestamp
      const messages = await this.messageModel
        .find({ usersIds: { $in: [userId] } })
        .sort({ timestamp: 1 })
        .exec(); // Ensure exec() is called for proper promise resolution

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async createMessage(message: string, usersIds: string[]) {
    console.log(usersIds);
    const newMessage = new this.messageModel({
      message,
      usersIds,
      creatorId: usersIds[0], // user who created the message always the first one
    });
    await newMessage.save();
    return newMessage;
  }

  async sendMessage(message: string, usersIds: string[]) {
    const roomId = usersIds.join(',');
    return await this.appGateway.handleSendMessage(null, {
      message,
      usersIds,
      roomId,
    });
  }

  async deleteMessage(id: string) {
    await this.messageModel.deleteOne({ _id: id });
  }

  async updateMessage(id: string, message: string) {
    await this.messageModel.updateOne({ _id: id }, { message, isEdited: true });
    return this.messageModel.findOne({ _id: id });
  }

  async archiveMessage(id: string) {
    await this.messageModel.updateOne({ _id: id }, { isArchived: true });
    return this.messageModel.findOne({ _id: id });
  }
}
