import { Module } from '@nestjs/common';
import { CardVariantsService } from './card-variants.service';
import { CardVariantsController } from './card-variants.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CardVariantsService],
  controllers: [CardVariantsController],
  exports: [CardVariantsService]
})
export class CardVariantsModule { }
