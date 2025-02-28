import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { SeriesService } from './series.service';
import { Serie } from '@prisma/client';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }

  @Get()
  @HttpCode(200)
  async getAll(): Promise<Serie[] | void> {
    return await this.seriesService.getAll()
  };

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<Serie | null> {
    return await this.seriesService.getById(Number(id))
  };
}


