import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Set } from '@prisma/client';
import { SetWithCards } from './interfaces/sets.interface';

@Injectable()
export class SetsService {
  constructor(private readonly prisma: PrismaService) { }

  async getAll(): Promise<Set[]> {
    return this.prisma.set.findMany()
  };

  async getById(id: number): Promise<SetWithCards | null> {
    const set = await this.prisma.set.findUnique({
      where: { id },
      include: {
        cards: {
          include: {
            variants: {
              include: {
                cardVariant: { select: { type: true } }
              }
            }
          }
        }
      }
    });

    if (!set) return null;

    set.cards.sort((a, b) => {
      const numA = parseInt(a.localId.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.localId.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });

    return set;
  }


  async getAllBySerieId(id: number): Promise<SetWithCards[]> {
    return this.prisma.set.findMany({
      where: { serieId: id },
      include: {
        cards: true
      }
    }) as Promise<SetWithCards[]>;
  };


  async getByCode(code: string): Promise<Set | null> {
    return this.prisma.set.findUnique({
      where: { code }
    });
  };

  async createManyTransaction(setsData: any[]) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.set.createManyAndReturn({
        data: setsData,
        skipDuplicates: true
      })
    })
  };

}
