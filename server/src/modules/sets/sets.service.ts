import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Set } from '@prisma/client';

@Injectable()
export class SetsService {
  constructor(private readonly prisma: PrismaService) { }

  async getAll(): Promise<Set[]> {
    return this.prisma.set.findMany()
  };

  async getById(id: number): Promise<Set | null> {
    return this.prisma.set.findUnique({
      where: { id },
      include: {
        cards: {
          include: {
            variants: {
              include: {
                cardVariant: {
                  select: { type: true }
                }
              }
            }
          }
        }
      }
    });
  }


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
