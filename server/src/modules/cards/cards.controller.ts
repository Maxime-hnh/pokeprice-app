import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from '@prisma/client';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

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

  @Get('/set/:setId')
  @HttpCode(200)
  async getBySetId(@Param('setId') setId: string): Promise<Card[] | void> {
    return await this.cardsService.getBySetId(Number(setId))
  };

}
