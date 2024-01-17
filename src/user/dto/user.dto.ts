import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  name: string;
  @IsOptional()
  @IsString()
  phone: string;
  @IsOptional()
  @IsString()
  avatarPath: string;
  @IsOptional()
  @IsEmail()
  email: string;
}
