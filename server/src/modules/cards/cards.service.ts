import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Card } from '@prisma/client';

@Injectable()
export class CardsService {

  constructor(private readonly prisma: PrismaService) { }

  async create(data: any) {
    return this.prisma.card.create({ data })
  };

  async createManyTransaction(cardsData: any[]): Promise<void> {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.card.createManyAndReturn({
        data: cardsData,
        skipDuplicates: false
      });
    });
  };

  async getAll(): Promise<Card[]> {
    return this.prisma.card.findMany()
  };

  async getBySetId(setId: number): Promise<Card[]> {
    return this.prisma.card.findMany({
      where: { setId }
    })
  };

  async getById(id: number): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: { id },
      include: { variants: true }
    })
  };

  async getByCode(code: string): Promise<Card | null> {
    return this.prisma.card.findUnique({ where: { code } })
  };

}
