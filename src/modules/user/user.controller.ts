import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { JwtGuard } from '../../guards/jwt.guard';
import { RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.userService.register(dto);
  }

  @ApiOperation({ summary: 'Логин' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.userService.login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'logout' })
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto, @Req() request: FastifyRequest) {
    const { id } = request.user;
    return await this.userService.logout(dto.refreshToken, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'refresh' })
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto, @Req() request: FastifyRequest) {
    const user = request.user;
    return await this.userService.refresh(dto.refreshToken, user);
  }
}
