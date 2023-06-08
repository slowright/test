import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken> {
    const token = await this.prisma.refreshToken.create({
      data: {
        userId,
        refreshToken,
      },
    });
    return token;
  }

  async deleteToken(refreshToken: string): Promise<RefreshToken> {
    const token = await this.prisma.refreshToken.delete({
      where: { refreshToken },
    });
    return token;
  }

  async findToken(token: string): Promise<RefreshToken> {
    return await this.prisma.refreshToken.findUnique({
      where: { refreshToken: token },
    });
  }
}
