import { Module } from '@nestjs/common';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [SetsService],
  controllers: [SetsController],
  exports: [SetsService]
})
export class SetsModule { }
