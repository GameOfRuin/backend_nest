import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { inject } from 'inversify';
import { redisRefreshTokenKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { UserEntity } from '../../database/entities';
import { TimeInSeconds } from '../../shared/time';
import { JwtService } from '../jwt/jwt.service';
import { RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('Bootstrap');

  constructor(
    @inject(RedisService)
    private readonly redis: RedisService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    console.log(`Регистрация нового пользователя email = ${dto.email}`);

    const exist = await UserEntity.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new Error('Такой email уже существует');
    }

    dto.password = await hash(dto.password, 10);

    const newUser = await UserEntity.create({ ...dto });

    const { password, ...user } = newUser.toJSON();

    return user;
  }

  async login(dto: LoginDto) {
    this.logger.log(`Пришли данные для логина. email = ${dto.email}`);

    const user = await UserEntity.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password } = user.toJSON();
    if (!(await compare(dto.password, password))) {
      throw new UnauthorizedException();
    }

    return await this.getTokenPair(user);
  }

  async refresh(token: RefreshTokenDto['refreshToken'], user: UserEntity) {
    const data = await this.redis.get(redisRefreshTokenKey(token));
    if (!data) {
      throw new Error();
    }

    const { id } = data;
    if (user.id !== id) {
      throw new UnauthorizedException();
    }

    await this.redis.delete(redisRefreshTokenKey(token));

    return await this.getTokenPair(user);
  }

  async logout(refreshToken: RefreshTokenDto['refreshToken'], userId?: UserEntity['id']) {
    this.logger.log(`Пришел запрос на logout refreshToken = ${refreshToken}`);

    const data = await this.redis.get(redisRefreshTokenKey(refreshToken));
    if (!data) {
      throw new UnauthorizedException();
    }

    const { id } = data;

    if (userId !== id) {
      throw new UnauthorizedException();
    }

    await this.redis.delete(redisRefreshTokenKey(refreshToken));

    return { message: 'Произошел выход' };
  }

  async getTokenPair(user: UserEntity) {
    const tokens = this.jwtService.makeTokenPair(user);
    const { id } = user;

    await this.redis.set(
      redisRefreshTokenKey(tokens.refreshSecret),
      { id },
      { EX: TimeInSeconds.day },
    );
    return tokens;
  }
}
