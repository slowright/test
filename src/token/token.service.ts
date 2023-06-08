import { Injectable } from '@nestjs/common';

//* Services
import { JwtService } from '@nestjs/jwt';

//* Repositories
import { TokenRepository } from './repository/token.repository';
import { RefreshToken } from '@prisma/client';
import { JwtTokens } from './dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async generateJwtTokens(id: string): Promise<JwtTokens> {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_ACCESS_TOKEN,
      expiresIn: 86000,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.SECRET_REFRESH_TOKEN,
      expiresIn: 86000 * 30,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken> {
    return await this.tokenRepository.saveRefreshToken(userId, refreshToken);
  }

  async removeToken(refreshToken: string) {
    return await this.tokenRepository.deleteToken(refreshToken);
  }

  async validateAccessToken(token: string) {
    const userData = this.jwtService.verify(token, {
      secret: process.env.SECRET_ACCESS_TOKEN,
    });
    return userData;
  }

  async validateRefreshToken(token: string) {
    const userData = this.jwtService.verify(token, {
      secret: process.env.SECRET_REFRESH_TOKEN,
    });
    return userData;
  }

  async findToken(refreshToken: string): Promise<RefreshToken> {
    const token = await this.tokenRepository.findToken(refreshToken);
    return token;
  }
}
