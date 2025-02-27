import { Module } from '@nestjs/common';
import { UserCardVariantsService } from './user-card-variants.service';
import { UserCardVariantsController } from './user-card-variants.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [UserCardVariantsService],
  controllers: [UserCardVariantsController]
})
export class UserCardVariantsModule { }
