import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Card } from '@prisma/client';
import { SetsService } from '../sets/sets.service';
import { CardCount } from '../sets/interfaces/sets.interface';
import { SeriesService } from '../series/series.service';
import { EbayService } from '../ebay/ebay.service';
import { UpdateCardDto } from './dto/cards.dto';

@Injectable()
export class CardsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly serieSerive: SeriesService,
    private readonly setService: SetsService,
    private readonly ebayService: EbayService,
  ) { }

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

  async updateCard(id: number, data: UpdateCardDto): Promise<Card> {
    return this.prisma.card.update({
      where: { id },
      data
    })
  };

  async updatePriceByCardId(card: Card): Promise<Card | null | undefined> {
    const eBaySearchResult = await this.ebayService.searchCardOnEbay(card.ebaySearchContent!);
    if (eBaySearchResult && eBaySearchResult.length > 0) {
      const priceStats = await this.ebayService.getPriceStats(eBaySearchResult);
      await this.updateCard(card.id, { lowestPrice: priceStats.lowestPrice, averagePrice: priceStats.averagePrice, highestPrice: priceStats.highestPrice });
    } else {
      return null;
    }
  }

  async updatePrices(serieId: number): Promise<any> {
    const serie = await this.serieSerive.getById(serieId);
    const sets = await this.setService.getAllBySerieId(serie!.id)

    const totalCards = sets.map(set => set.cards.length).reduce((sum, count) => sum + count, 0);

    console.log(`🚀 La serie ${serie!.name} contient ${totalCards} cartes`)
    let count = 0
    await Promise.all(
      sets.map(async (set) => {
        if (set.name.toLowerCase().includes("promo")) return;
        await Promise.all(
          set.cards.map(async (card) => {
            try {
              if (!card.averagePrice) {

                const eBaySearchResult = await this.ebayService.searchCardOnEbay(card.ebaySearchContent!);
                if (eBaySearchResult && eBaySearchResult.length > 0) {
                  const priceStats = await this.ebayService.getPriceStats(eBaySearchResult);
                  await this.updateCard(card.id, { lowestPrice: priceStats.lowestPrice, averagePrice: priceStats.averagePrice, highestPrice: priceStats.highestPrice });
                  count++
                }
              } else {
                return;
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération des prix pour la carte ID ${card.id} :`, error);
              console.log(`${count} cartes mises à jour`)
            }
          })
        );
      })
    );
    console.log(`${count} cartes mises à jour`)
  };

  async addEbaySearchContentValues() {
    const cards = await this.getAll();
    let counter = 0; // Compteur de mises à jour
    let failedCounter = 0; // Compteur d'échecs
    const totalCards = cards.length;

    console.log(`🚀 Début de la mise à jour des ${totalCards} cartes...`);

    for (const card of cards) {
      try {
        // 🔹 Vérifie si la carte a déjà une valeur `ebaySearchContent`
        if (card.ebaySearchContent !== null) continue;

        const set = await this.prisma.set.findFirst({
          where: { id: card.setId },
          include: { cards: true }
        });

        if (!set) return;

        let suffix: string | null = null;
        const containsAlphabet = /[a-zA-Z]/.test(card.localId);

        if (containsAlphabet) {
          const data = set.cards.filter(card => card.localId.includes('TG') || card.localId.includes('GG'));
          suffix = data.length.toString();
          if (set.cards.some(card => card.localId.includes('TG'))) {
            suffix = `/TG${data.length}`;
          } else if (set.cards.some(card => card.localId.includes('GG'))) {
            suffix = `/GG${data.length}`;
          }
        }

        const cardCount: CardCount = set?.cardCount as unknown as CardCount;
        const ebaySearchContent = card?.name + ' ' + card.localId + (containsAlphabet ? suffix : '/' + cardCount.official);

        await this.prisma.card.update({
          where: { id: card.id },
          data: { ebaySearchContent }
        });

        counter++;
        if (counter % 500 === 0 || counter === totalCards) {
          console.log(`📊 Progression: ${counter}/${totalCards} cartes mises à jour...`);
        }

      } catch (error) {
        failedCounter++;
        console.error(`❌ Erreur sur la carte ID ${card.id} :`, error.message);
      }
    }
    console.log(`✅ Mise à jour terminée : ${counter} réussies, ${failedCounter} échecs sur ${totalCards} cartes.`);
  }


}
