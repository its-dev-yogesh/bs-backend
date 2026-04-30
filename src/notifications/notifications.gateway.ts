import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AuthTokenService } from '../auth/services/token.service';

const NS = '/notifications';

function userRoom(userId: string) {
  return `user:${userId}`;
}

@WebSocketGateway({
  namespace: NS,
  cors: { origin: true, credentials: true },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly tokenService: AuthTokenService) {}

  handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }
    const payload = this.tokenService.verifyAccessToken(token);
    if (!payload?.sub) {
      client.disconnect(true);
      return;
    }
    void client.join(userRoom(payload.sub));
    client.data.userId = payload.sub;
    this.logger.log(`socket connected user=${payload.sub} sid=${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = (client.data as { userId?: string }).userId;
    this.logger.log(`socket disconnected user=${userId ?? 'unknown'} sid=${client.id}`);
  }

  /** Push a notification payload to all sockets a single user has open. */
  emitToUser(userId: string, event: string, payload: unknown) {
    if (!userId) return;
    this.server.to(userRoom(userId)).emit(event, payload);
  }

  private extractToken(client: Socket): string | null {
    const fromAuth = (client.handshake.auth as { token?: unknown } | undefined)
      ?.token;
    if (typeof fromAuth === 'string' && fromAuth.length > 0) return fromAuth;
    const fromQuery = client.handshake.query?.token;
    if (typeof fromQuery === 'string' && fromQuery.length > 0) return fromQuery;
    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice('Bearer '.length);
    }
    return null;
  }
}
