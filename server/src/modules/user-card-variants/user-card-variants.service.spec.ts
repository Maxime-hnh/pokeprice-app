import { Test, TestingModule } from '@nestjs/testing';
import { UserCardVariantsService } from './user-card-variants.service';

describe('UserCardVariantsService', () => {
  let service: UserCardVariantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCardVariantsService],
    }).compile();

    service = module.get<UserCardVariantsService>(UserCardVariantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
