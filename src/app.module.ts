import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { JwtModule } from './modules/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [JwtModule, UserModule, DatabaseModule, JwtModule],
})
export class AppModule {}
