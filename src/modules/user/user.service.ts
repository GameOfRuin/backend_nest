import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/entities';
import { RegisterDto } from './dto';

@Injectable()
export class UserService {
  async register(dto: RegisterDto) {
    console.log('Регистрация');

    const user = await UserEntity.create({ ...dto });

    return user;
  }
}
