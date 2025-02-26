import { Body, Controller, Post } from '@nestjs/common';
import { CardVariantsService } from './card-variants.service';

@Controller('cardVariants')
export class CardVariantsController {
  constructor(private readonly cardVariantsService: CardVariantsService) { }

  @Post()
  async create(@Body() body: any) {
    return await this.cardVariantsService.create(body)
  }
}
