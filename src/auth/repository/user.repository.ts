import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/auth/dto';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findUserByPhone(phone: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { phone } });
  }

  async findUserById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        phone: dto.phone,
        email: dto.email,
        password: dto.password,
        discount: dto.discount,
      },
    });
  }
}
