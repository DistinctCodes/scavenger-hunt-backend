import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
