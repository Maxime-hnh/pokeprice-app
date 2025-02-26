import { Module } from '@nestjs/common';
import { CardVariantOnCardsService } from './card-variant-on-cards.service';
import { CardVariantOnCardsController } from './card-variant-on-cards.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CardVariantOnCardsService],
  controllers: [CardVariantOnCardsController],
  exports: [CardVariantOnCardsService]
})
export class CardVariantOnCardsModule { }
