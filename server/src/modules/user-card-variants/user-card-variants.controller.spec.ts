import { Test, TestingModule } from '@nestjs/testing';
import { UserCardVariantsController } from './user-card-variants.controller';

describe('UserCardVariantsController', () => {
  let controller: UserCardVariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCardVariantsController],
    }).compile();

    controller = module.get<UserCardVariantsController>(UserCardVariantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
