import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardVariantOnCardsService {
  constructor(private readonly prisma: PrismaService) { }

  async createMany(data: any) {
    return this.prisma.cardVariantOnCard.createManyAndReturn({
      data,
      skipDuplicates: false
    });
  }
}
