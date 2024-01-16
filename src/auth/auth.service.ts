import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './auth.dto';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}
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
    return user;
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };
  }
}
