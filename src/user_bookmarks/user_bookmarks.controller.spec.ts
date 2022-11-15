import { Test, TestingModule } from '@nestjs/testing';
import { UserBookmarksController } from './user_bookmarks.controller';

describe('UserBookmarksController', () => {
  let controller: UserBookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBookmarksController],
    }).compile();

    controller = module.get<UserBookmarksController>(UserBookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
