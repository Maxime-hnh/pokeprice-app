import { Test, TestingModule } from '@nestjs/testing';
import { CardVariantOnCardsService } from './card-variant-on-cards.service';

describe('CardVariantOnCardsService', () => {
  let service: CardVariantOnCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardVariantOnCardsService],
    }).compile();

    service = module.get<CardVariantOnCardsService>(CardVariantOnCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
