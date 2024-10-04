import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications/notifications.service';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { MessagesService } from './messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private userSockets: Map<string, Socket> = new Map(); // Map to store userId and socket connection

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => MessagesService))
    private messagesService: MessagesService,
  ) {}

  afterInit(server: Server) {
    Logger.log('WebSocket Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query.userId as string; // Assume the first argument is userId
    this.userSockets.set(userId, client); // Store the socket connection
  }

  handleDisconnect(client: Socket) {
    this.userSockets.forEach((value, key) => {
      if (value.id === client.id) {
        this.userSockets.delete(key); // Remove disconnected user
      }
    });
  }

  @SubscribeMessage('addUser')
  async handleAddUser(client: Socket, userId: string) {
    this.userSockets.set(userId, client);
  }

  @SubscribeMessage('sendNotification')
  async handleSendNotification(
    client: Socket,
    payload: { message: string; userId: string },
  ) {
    const notification = await this.notificationsService.createNotification(
      payload.message,
      payload.userId,
    );
    const recipientSocket = this.userSockets.get(payload.userId);

    if (recipientSocket) {
      recipientSocket.emit('notification', notification); // Send notification to specific user
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { message: string; roomId: string; usersIds: string[] },
  ) {
    // Create the message in the database
    const Message = await this.messagesService.createMessage(
      payload.message,
      payload.usersIds,
    );

    const _client = this.userSockets.get(payload.usersIds[0]);

    // Send the message to all users in the room
    _client.to(payload.roomId).emit('message', Message); // Emit the message to the room

    return Message;
  }

  // Handle when a user joins a room (e.g., when they join a chat)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId); // Join the specified room
    client.emit('joinedRoom', roomId); // Notify the client they joined the room
  }

  // Optionally, handle when a user leaves a room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomId: string) {
    client.leave(roomId); // Leave the specified room
    client.emit('leftRoom', roomId); // Notify the client they left the room
  }
}
