import { Global, Module } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';
import { JwtService } from '../jwt/jwt.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Global()
@Module({
  controllers: [ArticleController],
  providers: [ArticleService, JwtService, RedisService],
})
export class ArticleModule {}
