import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

//* DTO`s
import {
  LoginUserDto,
  PhoneUserDto,
  RegisterUserDto,
  ResponseLoginUserDto,
  ResponseRegisterUserDto,
  UserDto,
} from './dto';

//* Services
import { TokenService } from 'src/token/token.service';

//* Repositories
import { UserRepository } from './repository/user.repository';
import { VerifyUserRepository } from './repository/verifyuser.repository';
import { UnVerificationUser } from '@prisma/client';

//* Libraries
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verifyUserRepository: VerifyUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async checkUserCode(dto: PhoneUserDto): Promise<UnVerificationUser> {
    const foundUserEmail = await this.userRepository.findUserByEmail(dto.email);
    const foundUserPhone = await this.userRepository.findUserByPhone(dto.phone);
    if (foundUserEmail || foundUserPhone)
      throw new BadRequestException(
        'Пользователь с таким email или номером телефона уже существует',
      );
    const verifyCode = 4444;
    const user = {
      ...dto,
      code: verifyCode,
    };
    return await this.verifyUserRepository.createUser(user);
  }

  async registerUser(dto: RegisterUserDto): Promise<ResponseRegisterUserDto> {
    const unVerificationUser = await this.verifyUserRepository.getUserByEmail(
      dto.email,
    );
    if (dto.code != unVerificationUser.code) {
      console.log(dto.code);
      throw new BadRequestException('Неверный код!');
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const candidate = {
      phone: dto.phone,
      email: dto.email,
      password: hashPassword,
      discount: 0,
    };
    const user = await this.userRepository.createUser(candidate);
    const tokens = await this.tokenService.generateJwtTokens(user.id);

    await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);
    await this.verifyUserRepository.deleteUser(user.email);
    return {
      ...tokens,
      user: {
        phone: user.phone,
        email: user.email,
      },
    };
  }

  async loginUser(dto: LoginUserDto): Promise<ResponseLoginUserDto> {
    const user = await this.userRepository.findUserByEmail(dto.email);
    if (!user) throw new BadRequestException('Неверный логин или пароль');
    const checkPassword = await bcrypt.compare(dto.password, user.password);
    if (!checkPassword)
      throw new BadRequestException('Неверный логин или пароль');

    const userDto = new UserDto(user);
    const tokens = await this.tokenService.generateJwtTokens(
      userDto.id.toString(),
    );

    await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logoutUser(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) throw new UnauthorizedException();

    const user = await this.userRepository.findUserById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await this.tokenService.generateJwtTokens(
      userDto.id.toString(),
    );

    await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}
