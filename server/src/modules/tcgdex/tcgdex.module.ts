import { Module } from '@nestjs/common';
import { TCGDexService } from './tcgdex.service';
import { SeriesModule } from '../series/series.module';
import { SetsModule } from '../sets/sets.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CardVariantOnCardsModule } from '../card-variant-on-cards/card-variant-on-cards.module';
import { CardsModule } from '../cards/cards.module';
import { CardVariantsModule } from '../card-variants/card-variants.module';

@Module({
  imports: [
    SeriesModule,
    SetsModule,
    PrismaModule,
    CardVariantOnCardsModule,
    CardsModule,
    CardVariantsModule
  ],
  providers: [TCGDexService],
  exports: [TCGDexService],
})
export class TCGDexModule { }
