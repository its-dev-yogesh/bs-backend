import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { CreateConnectionRequestDto } from './dto/create-connection-request.dto';
import { ConnectionsService } from './connections.service';

/** JWT `user` can be a plain object; normalize id for Mongo string fields. */
function currentUserId(user: User | undefined): string {
  if (!user) return '';
  const u = user as User & { _id?: unknown; id?: unknown };
  return String(u._id ?? u.id ?? '');
}

@ApiTags('Connections')
@Controller('connections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Header('Pragma', 'no-cache')
  list(@CurrentUser() user: User) {
    return this.connectionsService.listConnections(currentUserId(user));
  }

  @Get('suggestions')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Header('Pragma', 'no-cache')
  suggestions(@CurrentUser() user: User) {
    return this.connectionsService.suggestions(currentUserId(user));
  }

  @Post('requests')
  request(@CurrentUser() user: User, @Body() dto: CreateConnectionRequestDto) {
    return this.connectionsService.sendRequest(
      currentUserId(user),
      dto.userId,
    );
  }

  @Post('requests/:requestId/accept')
  accept(@CurrentUser() user: User, @Param('requestId') requestId: string) {
    return this.connectionsService.acceptRequest(
      currentUserId(user),
      requestId,
    );
  }

  @Post('requests/:requestId/decline')
  decline(@CurrentUser() user: User, @Param('requestId') requestId: string) {
    return this.connectionsService.declineRequest(
      currentUserId(user),
      requestId,
    );
  }

  @Delete(':userId')
  unfollow(@CurrentUser() user: User, @Param('userId') userId: string) {
    return this.connectionsService.removeConnection(
      currentUserId(user),
      userId,
    );
  }
}
