import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getProfile(id: number) {
    const profile = await this.prisma.user.findUnique({ where: { id } });
    if (!profile) throw new BadRequestException('Dont find a profile!');
  }
  async updateProfile(id: number, dto: UserDto) {}
  async toggleFavourites(productId: string, id: number) {}
}
