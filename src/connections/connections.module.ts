import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import {
  ConnectionRequest,
  ConnectionRequestSchema,
} from './schemas/connection-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConnectionRequest.name, schema: ConnectionRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
