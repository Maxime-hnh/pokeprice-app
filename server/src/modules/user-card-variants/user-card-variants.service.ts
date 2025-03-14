import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCardVariant } from '@prisma/client';

@Injectable()
export class UserCardVariantsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async getByIds(userId: number, cardId: number, cardVariantId: number): Promise<UserCardVariant | null> {
    return this.prisma.userCardVariant.findUnique({
      where: {
        userId_cardId_cardVariantId: {
          userId,
          cardId,
          cardVariantId
        }
      }
    })
  };

  async addLink(userId: number, cardId: number, cardVariantId: number, type: string = "own"): Promise<UserCardVariant> {
    return this.prisma.userCardVariant.create({ data: { userId, cardId, cardVariantId, type } })
  };

  async updateLink(userId: number, cardId: number, cardVariantId: number, type: string): Promise<UserCardVariant> {
    return this.prisma.userCardVariant.update({
      where: {
        userId_cardId_cardVariantId: {
          userId,
          cardId,
          cardVariantId
        }
      },
      data: {
        type
      }
    });
  }

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
  };

  async getAllOwnedByUserId(userId: number): Promise<UserCardVariant[]> {
    return this.prisma.userCardVariant.findMany({
      where: {
        userId,
        type: "own"
      }
    })
  };

  async getAllWishListByUserId(userId: number): Promise<UserCardVariant[]> {
    return this.prisma.userCardVariant.findMany({
      where: {
        userId,
        type: "wishList"
      }
    })
  };

}
