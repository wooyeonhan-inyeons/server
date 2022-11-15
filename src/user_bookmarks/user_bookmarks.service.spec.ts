import { Test, TestingModule } from '@nestjs/testing';
import { UserBookmarksService } from './user_bookmarks.service';

describe('UserBookmarksService', () => {
  let service: UserBookmarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBookmarksService],
    }).compile();

    service = module.get<UserBookmarksService>(UserBookmarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
