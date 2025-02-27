import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCardVariant } from '@prisma/client';

@Injectable()
export class UserCardVariantsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async addLink(userId: number, cardId: number, cardVariantId: number): Promise<UserCardVariant> {
    return this.prisma.userCardVariant.create({ data: { userId, cardId, cardVariantId } })
  };

  async removeLink(userId: number, cardId: number, cardVariantId: number): Promise<UserCardVariant> {
    return this.prisma.userCardVariant.delete({
      where: {
        userId_cardId_cardVariantId: {
          userId,
          cardId,
          cardVariantId
        }
      }
    });
  };

  async getAllByUserId(userId: number): Promise<UserCardVariant[]> {
    return this.prisma.userCardVariant.findMany({
      where: { userId }
    })
  }

}
