import { Test, TestingModule } from '@nestjs/testing';
import { CardVariantOnCardsController } from './card-variant-on-cards.controller';

describe('CardVariantOnCardsController', () => {
  let controller: CardVariantOnCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardVariantOnCardsController],
    }).compile();

    controller = module.get<CardVariantOnCardsController>(CardVariantOnCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
