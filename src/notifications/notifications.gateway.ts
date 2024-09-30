import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { forwardRef, Inject, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private userSockets: Map<string, Socket> = new Map(); // Map to store userId and socket connection

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
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
}
