import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import {
  returnFavoritesOfUserObject,
  returnUserObject,
} from './return-user-object';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getProfile(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...returnUserObject,
        favorites: {
          select: returnFavoritesOfUserObject,
        },
        ...selectObject,
      },
    });
    if (!user) throw new BadRequestException('Dont find a user!');
    return user;
  }
  async updateProfile(id: number, dto: UserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!existUser) throw new BadRequestException('Email already in use!');
    const user = await this.getProfile(id);
    return await this.prisma.user.update({
      where: { id: existUser.id },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });
  }
  async toggleFavourites(productId: number, userId: number) {
    console.log(productId, 'productId');
    const user = await this.getProfile(userId);
    if (!user) throw new NotFoundException('Dont find a user!');
    const isExists = user.favorites.some((item) => item.id === productId);
    console.log(user);
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     favorites: isExists
    //       ? { disconnect: { id: productId } }
    //       : { connect: { id: productId } },
    //   },
    // });
    return 'success';
  }
}
