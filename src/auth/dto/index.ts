import { IsEmail, IsInt, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  code: string;
}

export class PhoneUserDto {
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  discount: number;
}

export class CreateVerifyUserDto {
  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  code: number;
}

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsInt()
  discount: number;

  constructor(model) {
    this.id = model.id;
    this.phone = model.phone;
    this.email = model.email;
    this.discount = model.discount;
  }
}

export class ResponseRegisterUserDto {
  accessToken: string;
  refreshToken: string;
  user: {
    phone: string;
    email: string;
  };
}

export class ResponseLoginUserDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
