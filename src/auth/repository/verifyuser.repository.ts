import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVerifyUserDto } from 'src/auth/dto';
import { UnVerificationUser } from '@prisma/client';

@Injectable()
export class VerifyUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<UnVerificationUser> {
    return await this.prisma.unVerificationUser.findUnique({
      where: { email },
    });
  }

  async createUser(dto: CreateVerifyUserDto): Promise<UnVerificationUser> {
    return await this.prisma.unVerificationUser.create({
      data: {
        phone: dto.phone,
        email: dto.email,
        password: dto.password,
        code: dto.code.toString(),
      },
    });
  }

  async deleteUser(email: string): Promise<UnVerificationUser> {
    return await this.prisma.unVerificationUser.delete({ where: { email } });
  }
}
