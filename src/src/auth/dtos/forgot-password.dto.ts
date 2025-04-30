import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RestPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  newpassword: string;
}
