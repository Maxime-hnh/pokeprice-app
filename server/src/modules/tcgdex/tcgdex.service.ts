import { Injectable, Logger } from '@nestjs/common';
import TCGdex from '@tcgdex/sdk';
import { SeriesService } from '../series/series.service';
import { SetsService } from '../sets/sets.service';
import { CardVariantsService } from 'src/modules/card-variants/card-variants.service';
import { CardsService } from '../cards/cards.service';
import { CardVariantOnCardsService } from '../card-variant-on-cards/card-variant-on-cards.service';
import { PrismaService } from '../prisma/prisma.service';

enum Rarity {
  COMMON = "Commune",
  NORMAL = "Peu Commune",
  HOLO = "Rare",
  EX = "Double rare",
  FULL_ART = "Ultra Rare",
  SAR = "Illustration spéciale rare",
  GOLD = "Hyper rare",
  HIGH_TECH = "HIGH-TECG rare"
};

@Injectable()
export class TCGDexService {
  private readonly tcgdex: TCGdex;
  private readonly logger = new Logger(TCGDexService.name);

  constructor(
    private readonly seriesService: SeriesService,
    private readonly setsService: SetsService,
    private readonly cardsService: CardsService,
    private readonly CardVariantsService: CardVariantsService,
    private readonly cardVariantOnCardsService: CardVariantOnCardsService,
    private readonly prisma: PrismaService,
  ) {
    this.tcgdex = new TCGdex("fr");
    this.logger.log('TCGDex SDK initialisé');

  }

  async getVariants() {
    try {
      return await this.tcgdex.fetch('variants')
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des variantes`, error);
      throw error;
    }
  }
  async getCardById(id: string) {
    try {
      return await this.tcgdex.fetch('cards', id);
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de la carte: ${id}`, error);
      throw error;
    }
  }

  async insertSeries(): Promise<void> {
    try {
      const series = await this.tcgdex.fetch('series')
      if (!series || series.length === 0) return;

      const existingSeries = await this.seriesService.getAll();
      const existingCodes = new Set(existingSeries.map(s => s.code))
      const newSeries = series.filter(serie => !existingCodes.has(serie.id));

      if (newSeries.length === 0) return;

      // Préparer les données à insérer
      const seriesData = newSeries.map(serie => ({
        code: serie.id,
        name: serie.name,
        logo: serie.logo ?? null
      }));

      await this.seriesService.createManyTransaction(seriesData);

    } catch (error) {
      console.error("Erreur lors de l'insertion des séries :", error);
    }
  };

  async insertSets(): Promise<void> {
    try {
      const sets = await this.tcgdex.fetch('sets')
      if (!sets || sets.length === 0) return;

      const existingSets = await this.setsService.getAll();
      const existingCodes = new Set(existingSets.map(s => s.code))
      const newSets = sets.filter(set => !existingCodes.has(set.id));

      if (newSets.length === 0) return;

      const setsData = await Promise.all(newSets.map(async (set) => {
        const fullDataSet = await this.tcgdex.fetch('sets', set.id);
        if (!fullDataSet) throw new Error;
        const serie = await this.seriesService.getByCode(fullDataSet.serie.id)
        if (!serie) throw new Error;
        return {
          code: fullDataSet.id,
          name: fullDataSet.name,
          logo: fullDataSet.logo ?? null,
          symbol: fullDataSet.symbol ?? null,
          cardCount: fullDataSet.cardCount,
          tcgOnline: fullDataSet.tcgOnline ?? null,
          releaseDate: fullDataSet.releaseDate ? new Date(fullDataSet.releaseDate) : null,
          legal: fullDataSet.legal,
          serieId: serie.id
        };
      }));

      if (setsData.length === 0) return;
      await this.setsService.createManyTransaction(setsData);

    } catch (error) {
      console.error("Erreur lors de l'insertion des sets :", error);
    }
  };

 
  async insertCards() {
    try {
      // get all variants from database
      let allVariants = await this.prisma.cardVariant.findMany();
      const variantMap = new Map(allVariants.map(v => [v.type.toLowerCase(), v.id]));

      // get all cards from tcgdex
      const cards = await this.tcgdex.fetch('cards');
      if (!cards || cards.length === 0) return;

      let cardsToInsert: any = [];
      let cardVariantsToInsert: any = [];

      for (const card of cards) {
        try {
          if (card.id.startsWith("sv08.5")) {
            console.log(`⏩ Carte ignorée (Set 161) : ${card.name} (${card.id})`);
            continue; // Passe à la carte suivante
          }
          const fullDataCard = await this.tcgdex.fetch('cards', card.id);
          if (!fullDataCard) throw new Error(`Carte introuvable : ${card.id}`);
          const set = await this.setsService.getByCode(fullDataCard.set.id)
          if (!set) throw new Error("set in database not found")

          // Préparer les données de la carte pour un batch insert
          const newCardData = {
            code: fullDataCard.id, // L'ID TCGdex (String)
            localId: fullDataCard.localId,
            name: fullDataCard.name,
            image: fullDataCard.image ?? null,
            category: fullDataCard.category ?? null,
            illustrator: fullDataCard.illustrator ?? null,
            rarity: fullDataCard.rarity ?? null,
            temporaryVariants: fullDataCard.variants,
            setId: set.id,
          };
          cardsToInsert.push(newCardData);
        } catch (error) {
          console.error(`❌ Erreur sur la carte ${card.id} :`, error.message);
        }
      };

      await this.prisma.$transaction(async (tx) => {
        //1 Filtrer pour retirer temporaryVariants des cartes à sauvegarder
        const dataToInsert = cardsToInsert.map(({ temporaryVariants, ...card }) => card);

        // 12 Insérer toutes les cartes en batch
        const insertedCards = await tx.card.createManyAndReturn({ data: dataToInsert, select: { id: true, code: true }, });


        // 3️ Construire les associations `CardVariantOnCard`
        for (const card of insertedCards) {

          const cardWithVariants = cardsToInsert.find((c: any) => c.code === card.code)

          const cardVariants = Object.entries(cardWithVariants.temporaryVariants)
            .filter(([variantType, value]) => value === true)
            .map(([variantType]) => variantType.toLowerCase())
            .map((variantType: any) => ({
              cardId: card.id,
              cardVariantId: variantMap.get(variantType)
            }))
            .filter((variant: any) => variant.cardVariantId !== undefined);

          cardVariantsToInsert.push(...cardVariants);
        }

        // 4️⃣ Insérer les associations `CardVariantOnCard`
        if (cardVariantsToInsert.length > 0) {
          await tx.cardVariantOnCard.createMany({ data: cardVariantsToInsert, skipDuplicates: true });
        }
      }, { timeout: 6000000 });

      console.log(`✅ cartes insérées avec succès.`);
    } catch (error) {
      console.error("❌ Transaction annulée :", error);
    }
  };

  async insertPrismaticEvolution() {
    try {
      let allVariants = await this.prisma.cardVariant.findMany();
      const variantMap = new Map(allVariants.map(v => [v.type.toLowerCase(), v.id]));
      
      const set = await this.tcgdex.fetch('sets', "sv08.5");
      if (!set) throw new Error("set not found")

      let cardsToInsert: any = [];
      let cardVariantsToInsert: any = [];

      for (const card of set.cards) {
        const fullDataCard = await this.tcgdex.fetch('cards', card.id);
        if (!fullDataCard) throw new Error(`Carte introuvable : ${card.id}`);
        const setFromDatabase = await this.setsService.getByCode(fullDataCard.set.id)
        if (!setFromDatabase) throw new Error("set in database not found")

        let customVariants = {};
        switch (fullDataCard.rarity) {
          case Rarity.COMMON:
          case Rarity.NORMAL:
            customVariants = { "normal": true, "reverse": true, "pokeball": true, "masterball": true }
            break;
          case Rarity.HOLO:
            customVariants = { "holo": true, "reverse": true, "pokeball": true, "masterball": true }
            break;
          case Rarity.EX:
          case Rarity.FULL_ART:
          case Rarity.SAR:
          case Rarity.GOLD:
          case Rarity.HIGH_TECH:
            customVariants = { "holo": true }
            break;
          default:
            customVariants = {}
        };

        const newCardData = {
          code: fullDataCard.id, // L'ID TCGdex (String)
          localId: fullDataCard.localId,
          name: fullDataCard.name,
          image: fullDataCard.image ?? null,
          category: fullDataCard.category ?? null,
          illustrator: fullDataCard.illustrator ?? null,
          rarity: fullDataCard.rarity ?? null,
          temporaryVariants: customVariants,
          setId: setFromDatabase.id,
        };
        cardsToInsert.push(newCardData);
      };

      await this.prisma.$transaction(async (tx) => {
        //1 Filtrer pour retirer temporaryVariants des cartes à sauvegarder
        const dataToInsert = cardsToInsert.map(({ temporaryVariants, ...card }) => card);

        // 12 Insérer toutes les cartes en batch
        const insertedCards = await tx.card.createManyAndReturn({ data: dataToInsert, select: { id: true, code: true }, });


        // 3️ Construire les associations `CardVariantOnCard`
        for (const card of insertedCards) {

          const cardWithVariants = cardsToInsert.find((c: any) => c.code === card.code)

          const cardVariants = Object.entries(cardWithVariants.temporaryVariants)
            .filter(([variantType, value]) => value === true)
            .map(([variantType]) => variantType.toLowerCase())
            .map((variantType: any) => ({
              cardId: card.id,
              cardVariantId: variantMap.get(variantType)
            }))
            .filter((variant: any) => variant.cardVariantId !== undefined);

          cardVariantsToInsert.push(...cardVariants);
        }

        // 4️⃣ Insérer les associations `CardVariantOnCard`
        if (cardVariantsToInsert.length > 0) {
          await tx.cardVariantOnCard.createMany({ data: cardVariantsToInsert, skipDuplicates: true });
        }
      }, { timeout: 6000000 });

      console.log(`✅ cartes insérées avec succès.`);
    } catch (error) {
      console.error("❌ Transaction annulée :", error);
    }
  }
}
