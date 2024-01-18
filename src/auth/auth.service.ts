import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token!');
    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
    });
    const tokens = await this.issueTokens(user.id);
    return { user: this.returnUserFields(user), ...tokens };
  }
  async register(dto: AuthDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existUser) throw new BadRequestException('User is already exist!');
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        name: dto.name,
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number(),
      },
    });
    const tokens = await this.issueTokens(user.id);
    return { user: this.returnUserFields(user), ...tokens };
  }
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);
    return { user: this.returnUserFields(user), ...tokens };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, { expiresIn: '12h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '10d' });
    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User is not exist!');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('incorrect Password!');
    return user;
  }
}
