import { Test, TestingModule } from '@nestjs/testing';
import { CardVariantsController } from './card-variants.controller';

describe('CardVariantsController', () => {
  let controller: CardVariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardVariantsController],
    }).compile();

    controller = module.get<CardVariantsController>(CardVariantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
