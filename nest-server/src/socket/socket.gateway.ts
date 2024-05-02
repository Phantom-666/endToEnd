import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type OnlineUsers = {
  id: string;
  userId: string;
};

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers: OnlineUsers[] = [];

  handleConnection(client: Socket) {
    // const token = client.handshake.query.token;
    const userId = client.handshake.query.userId;

    const newUser = {
      id: client.id,
      userId,
    };
    const status = this.onlineUsers.find((u) => u.userId === userId);
    if (status) return console.log('warning');
    this.onlineUsers.push(newUser);
    console.log('onlineUsers', this.onlineUsers);

    this.server.emit(`isOnline_${userId}`, { status: true });
  }

  handleDisconnect(client: Socket) {
    console.log('disconnect', client.id);

    let user: OnlineUsers | null = null;

    for (let i = 0; i < this.onlineUsers.length; ++i) {
      if (this.onlineUsers[i].id === client.id) {
        user = this.onlineUsers[i];
        break;
      }
    }

    if (user) {
      //check in online subscribers

      this.server.emit(`isOnline_${user.userId}`, { status: false });
    }

    this.onlineUsers = this.onlineUsers.filter((u) => u.id !== client.id);
  }

  @SubscribeMessage('isOnline')
  handleIsOnline(client: Socket, payload: { userId: string }) {
    let status = false;
    for (let i = 0; i < this.onlineUsers.length; ++i) {
      if (this.onlineUsers[i].userId === payload.userId) {
        status = true;
        break;
      }
    }

    client.emit(`isOnline`, { status });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { id: string; message: string }) {
    const partner = this.onlineUsers.find((u) => u.userId === payload.id);
    const instance = this.onlineUsers.find((u) => u.id === client.id);

    if (!partner) return;
    if (!instance) return;

    this.server.to(partner.id).emit('messageForYou', {
      id: instance.userId,
      message: payload.message,
    });
  }
}
