import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Serie } from '@prisma/client';

@Injectable()
export class SeriesService {

  constructor(private readonly prisma: PrismaService) { }

  async create(data: any) {
    const serie = this.prisma.serie.create({ data })
    return serie
  };

  async createManyTransaction(seriesData: { code: string, name: string, logo: string | null }[]): Promise<void> {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.serie.createManyAndReturn({
        data: seriesData,
        skipDuplicates: false
      });
    });
  };

  async getAll(): Promise<Serie[]> {
    return this.prisma.serie.findMany({
      orderBy: {
        id: 'desc'
      },
      include: {
        sets: {
          orderBy: {
            id: 'desc'
          }
        }
      }
    })
  };

  async getById(id: number): Promise<Serie | null> {
    return this.prisma.serie.findUnique({
      where: { id },
      include: {
        sets: {
          orderBy: {
            id: 'desc'
          }
        }
      }
    })
  };

  async getByCode(code: string): Promise<Serie | null> {
    return this.prisma.serie.findUnique({
      where: { code }
    })
  };

}
