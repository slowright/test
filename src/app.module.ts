import { Module } from '@nestjs/common';

//* Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [PrismaModule, AuthModule, TokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
