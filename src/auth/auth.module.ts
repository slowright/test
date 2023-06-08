import { Module } from '@nestjs/common';

//* Services
import { AuthService } from './auth.service';

//* Controllers
import { AuthController } from './auth.controller';

//* Modules
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';

//* Repositories
import { UserRepository } from './repository/user.repository';
import { VerifyUserRepository } from './repository/verifyuser.repository';

@Module({
  imports: [PrismaModule, TokenModule],
  providers: [AuthService, UserRepository, VerifyUserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
