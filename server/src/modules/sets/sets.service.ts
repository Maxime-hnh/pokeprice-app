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
      const numericRegex = /^\d+$/; // 🔹 Détecte uniquement les nombres
      const prefixRegex = /^([A-Z]+)(\d+)$/i; // 🔹 Détecte `TG01`, `GG02`, etc.

      const isNumA = numericRegex.test(a.localId);
      const isNumB = numericRegex.test(b.localId);

      if (isNumA && isNumB) {
        // 🔹 Trier les nombres purs (1, 2, 100)
        return parseInt(a.localId, 10) - parseInt(b.localId, 10);
      }

      if (isNumA) return -1; // 🔹 Les nombres purs viennent avant tout
      if (isNumB) return 1;

      // 🔹 Extraire les préfixes et les numéros
      const matchA = a.localId.match(prefixRegex);
      const matchB = b.localId.match(prefixRegex);

      if (matchA && matchB) {
        const prefixOrder: Record<string, number> = { "TG": 1, "GG": 2 }; // Priorité du tri
        const prefixA = matchA[1].toUpperCase(); // Ex: `TG`
        const prefixB = matchB[1].toUpperCase();
        const numA = parseInt(matchA[2], 10) || 0;
        const numB = parseInt(matchB[2], 10) || 0;

        // 🔹 Trier selon la priorité des préfixes (TG avant GG)
        if (prefixA !== prefixB) {
          return (prefixOrder[prefixA] || 99) - (prefixOrder[prefixB] || 99);
        }

        // 🔹 Trier selon le numéro (`TG01` avant `TG02`)
        return numA - numB;
      }

      if (matchA) return -1; // 🔹 Les préfixes connus viennent avant les valeurs inconnues
      if (matchB) return 1;

      // 🔹 Si `localId` est totalement inconnu, le mettre en dernier
      return 1;
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
