import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';
import { RegisterDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @Post()
  async register(@Body() dto: RegisterDto): Promise<UserEntity> {
    return await this.userService.register(dto);
  }
}
