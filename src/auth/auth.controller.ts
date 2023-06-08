import { Controller, Post, Body, Res, Req, Param, Get } from '@nestjs/common';

//* DTO`s
import { LoginUserDto, PhoneUserDto, RegisterUserDto } from './dto';

//* Services
import { AuthService } from './auth.service';

//* Express
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone')
  async getUserCode(@Body() dto: PhoneUserDto) {
    return await this.authService.checkUserCode(dto);
  }

  @Post('registration')
  async registerUser(@Body() dto: RegisterUserDto, @Res() res: Response) {
    const userData = await this.authService.registerUser(dto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });
    res.json(userData);
  }

  @Post('login')
  async loginUser(@Body() dto: LoginUserDto, @Res() res: Response) {
    const userData = await this.authService.loginUser(dto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });
    res.json(userData);
  }

  @Post('logout')
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    await this.authService.logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    res.sendStatus(200);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;

    const userData = await this.authService.refreshToken(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });
    res.json(userData);
  }

  @Get('test')
  async sendMail() {
    const ans = await fetch('https://service.qtelecom.ru/public/http/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8 ',
        user: '41741',
        pass: 'zelenov',
        action: 'post_sms',
        message: 'Hello',
        target: '+79606939375',
      },
      body: JSON.stringify({
        user1: '41741',
        pass1: 'zelenov',
        action: 'post_sms',
        target: '+79606939375',
        CLIENTADR: '127.0.0.1',
        post_id: 'xxx',
      }),
    });
    return ans.headers;
  }
}
