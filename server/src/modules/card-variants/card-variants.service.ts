import { Injectable } from '@nestjs/common';
import { CardVariant } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CardVariantsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: any): Promise<CardVariant | null> {
    return this.prisma.cardVariant.create({ data })
  };

  async getAll(): Promise<CardVariant[]> {
    return this.prisma.cardVariant.findMany()
  }

  async createMany(data: any) {
    return this.prisma.cardVariant.createMany({
      data: data,
      skipDuplicates: false
    });
  }
}
