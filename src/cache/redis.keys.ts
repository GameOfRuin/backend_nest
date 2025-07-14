import { RefreshTokenDto } from '../modules/user/dto/refresh-token.dto';

export const redisRefreshTokenKey = (refreshToken: RefreshTokenDto['refreshToken']) =>
  `refresh:${refreshToken}`;
