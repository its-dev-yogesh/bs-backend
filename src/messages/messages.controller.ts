import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('threads')
  listThreads(@CurrentUser() user: User) {
    return this.messagesService.listThreads(user._id ?? '');
  }

  @Get('threads/:id')
  getThread(@CurrentUser() user: User, @Param('id') id: string) {
    return this.messagesService.getThreadMessages(user._id ?? '', id);
  }

  @Post('threads/:threadId/messages')
  send(
    @CurrentUser() user: User,
    @Param('threadId') threadId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.send(user._id ?? '', threadId, dto);
  }
}
