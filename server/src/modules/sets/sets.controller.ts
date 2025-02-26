import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { SetsService } from './sets.service';
import { Set } from '@prisma/client';

@Controller('sets')
export class SetsController {
  constructor(private readonly setService: SetsService) { }

  @Get()
  @HttpCode(200)
  async getAll(): Promise<Set[] | void> {
    return await this.setService.getAll();
  };

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<Set | null> {
    return await this.setService.getById(Number(id))
  };
}
