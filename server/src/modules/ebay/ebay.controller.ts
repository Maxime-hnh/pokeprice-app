import { Controller, Get, HttpException, HttpStatus, Param, Query } from "@nestjs/common";
import { EbayService } from "./ebay.service";

@Controller('ebay')
export class EbayController {
  constructor(private readonly ebayService: EbayService) { }


  @Get('search')
  async search(@Query('q') query: string) {
    const results = await this.ebayService.searchCardOnEbay(query);
    return { success: true, data: results };
  }
}