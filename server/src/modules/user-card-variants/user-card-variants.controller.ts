import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserCardVariantsService } from './user-card-variants.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User, UserCardVariant } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('userCardVariants')
export class UserCardVariantsController {
  constructor(private readonly ucvService: UserCardVariantsService) { }


  @UseGuards(JwtAuthGuard)
  @Post('/card/:cardId/cardVariant/:cardVariantId')
  async addLink(
    @Param('cardId') cardId: string,
    @Param('cardVariantId') cardVariantId: string,
    @CurrentUser() user: User
  ): Promise<UserCardVariant | void> {
    return await this.ucvService.addLink(user.id, Number(cardId), Number(cardVariantId))
  };

  @UseGuards(JwtAuthGuard)
  @Delete('/card/:cardId/cardVariant/:cardVariantId')
  async removeLink(
    @Param('cardId') cardId: string,
    @Param('cardVariantId') cardVariantId: string,
    @CurrentUser() user: User
  ): Promise<UserCardVariant | void> {
    return await this.ucvService.removeLink(user.id, Number(cardId), Number(cardVariantId))
  };

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllByUserId(@CurrentUser() user: User): Promise<UserCardVariant[] | void> {
    return await this.ucvService.getAllByUserId(user.id)
  };

}
