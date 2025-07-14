import { Global, Module } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';
import { JwtService } from '../jwt/jwt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, RedisService],
})
export class UserModule {}
