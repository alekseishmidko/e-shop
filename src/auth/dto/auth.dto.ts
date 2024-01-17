import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  @IsString()
  password: string;
  @IsOptional()
  @MinLength(2)
  @IsString()
  name: string;
}
