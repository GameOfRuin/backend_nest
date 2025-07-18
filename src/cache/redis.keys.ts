import { ArticlesEntity } from '../database/entities';
import { GetArticleListDto } from '../modules/article/dto/sort-by.dto';
import { RefreshTokenDto } from '../modules/user/dto/refresh-token.dto';

export const redisRefreshTokenKey = (refreshToken: RefreshTokenDto['refreshToken']) =>
  `refresh:${refreshToken}`;
export const redisArticleKey = (id: ArticlesEntity['id']) => `article:${id}`;
export const redisArticlesKey = (query: GetArticleListDto) =>
  `tasks:limit=${query.limit}:offset=${query.offset}:sortBy=${query.sortBy}:sortDirection=${query.sortDirection}`;
