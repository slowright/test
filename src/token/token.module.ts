import { Module } from '@nestjs/common';

//* Modules
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

//* Services
import { TokenService } from './token.service';

//* Repositories
import { TokenRepository } from './repository/token.repository';

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
