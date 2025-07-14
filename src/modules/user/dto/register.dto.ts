import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'john@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'Alex Parker' })
  name: string;

  @ApiProperty({
    example: 'PasswordS',
    description: 'Пароль должен быть не менее 6 символов и максимум 256',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
