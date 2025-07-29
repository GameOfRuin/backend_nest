import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthorizedFastifyRequest } from '../app.types';
import { UserEntity } from '../database/entities';
import { JwtService } from '../modules/jwt/jwt.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthorizedFastifyRequest>();

    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Extract schema and token from header
    const [schema, token] = authorization.split(' ');
    if (schema !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Verify token
    const valid = this.jwtService.verify(token, 'access');
    if (!valid) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Decode token
    const payload = this.jwtService.decode(token);

    // Find user by credentials from token
    const user = await UserEntity.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.user = user;

    return true;
  }
}
