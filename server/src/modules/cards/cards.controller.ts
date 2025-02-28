import { Controller, Get, HttpCode, NotFoundException, Param, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from '@prisma/client';
import { SetsService } from '../sets/sets.service';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
  ) { }

  @Get()
  @HttpCode(200)
  async getAll(): Promise<Card[] | void> {
    return await this.cardsService.getAll()
  };

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<Card | null> {
    return await this.cardsService.getById(Number(id))
  };

  @Put('/price/:id')
  async updatePriceByCardId(@Param('id') id: string): Promise<any> {
    const card = await this.cardsService.getById(Number(id))
    if (!card) throw new NotFoundException(`card with id ${id} not found.`)
    return await this.cardsService.updatePriceByCardId(card)
  }

  @Get('/set/:setId')
  @HttpCode(200)
  async getBySetId(@Param('setId') setId: string): Promise<Card[] | void> {
    return await this.cardsService.getBySetId(Number(setId))
  };


  @Put('addEbaySearchContent')
  async updateAll(): Promise<any> {
    return await this.cardsService.addEbaySearchContentValues();
  };

  @Put('/serie/:serieId')
  async updatePricesBySerieId(@Param('serieId') serieId: string): Promise<any> {
    return await this.cardsService.updatePrices(Number(serieId))
  }

}
