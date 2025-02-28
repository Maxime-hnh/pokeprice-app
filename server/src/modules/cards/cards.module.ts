import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SetsService } from '../sets/sets.service';
import { SeriesService } from '../series/series.service';
import { EbayService } from '../ebay/ebay.service';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [CardsService, SetsService, SeriesService, EbayService],
  controllers: [CardsController],
  exports: [CardsService]
})
export class CardsModule { }
