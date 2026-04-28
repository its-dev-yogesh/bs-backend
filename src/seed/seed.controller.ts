import {
  Body,
  CanActivate,
  Controller,
  Delete,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SeedService } from './seed.service';

@Injectable()
class NonProductionGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(_ctx: ExecutionContext): boolean {
    const env = this.configService.get<string>('NODE_ENV') ?? 'development';
    if (env === 'production') {
      throw new ForbiddenException('Seed endpoints are disabled in production');
    }
    return true;
  }
}

class SeedUsersDto {
  count?: number;
  agentRatio?: number;
}

class SeedPostsDto {
  perUser?: number;
}

class SeedAllDto {
  users?: number;
  postsPerUser?: number;
}

class DevLoginDto {
  identifier: string;
}

@ApiTags('Seed')
@Controller('seed')
@UseGuards(NonProductionGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('users')
  @ApiOperation({
    summary:
      'Seed test users (mix of agents and users). Idempotent: existing usernames are skipped.',
  })
  @ApiResponse({ status: 201, description: 'Users created' })
  seedUsers(@Body() body: SeedUsersDto = {}) {
    return this.seedService.seedUsers(body.count, body.agentRatio);
  }

  @Post('posts')
  @ApiOperation({
    summary:
      'Seed posts for existing seed users. Agents get listings; users get requirements.',
  })
  seedPosts(@Body() body: SeedPostsDto = {}) {
    return this.seedService.seedPosts(body.perUser);
  }

  @Post('all')
  @ApiOperation({ summary: 'Seed users and posts in one go' })
  seedAll(@Body() body: SeedAllDto = {}) {
    return this.seedService.seedAll(body.users, body.postsPerUser);
  }

  @Delete('all')
  @ApiOperation({
    summary:
      'Delete all seeded users, their posts, media, and feed entries (matched by seed_ prefix).',
  })
  clearAll() {
    return this.seedService.clearAll();
  }

  @Post('dev-login')
  @ApiOperation({
    summary:
      'Issue JWT tokens for any user by username or phone, bypassing OTP. Dev only.',
  })
  devLogin(@Body() body: DevLoginDto) {
    return this.seedService.devLogin(body.identifier);
  }
}
