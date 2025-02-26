import { Test, TestingModule } from '@nestjs/testing';
import { CardVariantsService } from './card-variants.service';

describe('CardVariantsService', () => {
  let service: CardVariantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardVariantsService],
    }).compile();

    service = module.get<CardVariantsService>(CardVariantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
