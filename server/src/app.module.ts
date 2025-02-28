import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersController } from './modules/users/users.controller';
import { TCGDexModule } from './modules/tcgdex/tcgdex.module';
import { TCGDexController } from './modules/tcgdex/tcgdex.controller';
import { CardVariantOnCardsModule } from './modules/card-variant-on-cards/card-variant-on-cards.module';
import { CardVariantsModule } from './modules/card-variants/card-variants.module';
import { CardsModule } from './modules/cards/cards.module';
import { SetsModule } from './modules/sets/sets.module';
import { SeriesModule } from './modules/series/series.module';
import { UserCardVariantsModule } from './modules/user-card-variants/user-card-variants.module';
import { JobsService } from './modules/jobs/jobs.service';
import { JobsModule } from './modules/jobs/jobs.module';
import { EbayModule } from './modules/ebay/ebay.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    RolesModule,
    AuthModule,
    PrismaModule,
    TCGDexModule,
    SeriesModule,
    SetsModule,
    CardsModule,
    CardVariantsModule,
    CardVariantOnCardsModule,
    UserCardVariantsModule,
    JobsModule,
    EbayModule
  ],
  controllers: [AppController, UsersController, TCGDexController],
  providers: [AppService, JobsService],
})
export class AppModule { }
