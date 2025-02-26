import { Controller, Get, Post } from '@nestjs/common';
import { TCGDexService } from './tcgdex.service';

@Controller('tcgdex')
export class TCGDexController {
  constructor(private readonly tcgDexService: TCGDexService) { }

  @Post('series')
  async createSeries(): Promise<void> {
    return await this.tcgDexService.insertSeries();
  };

  @Post('sets')
  async createSets(): Promise<void> {
    return await this.tcgDexService.insertSets();
  };

  @Post('cards')
  async createCards(): Promise<void> {
    return await this.tcgDexService.insertCards();
  };
  
  @Post('cards/prismaticEvolution')
  async insertPrismaticEvolution(): Promise<void> {
    return await this.tcgDexService.insertPrismaticEvolution();
  };

  @Get('variants')
  async getVariants() {

    return await this.tcgDexService.getVariants();
  }


}
