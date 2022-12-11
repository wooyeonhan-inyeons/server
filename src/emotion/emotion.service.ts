import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from './emotion.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Posting } from 'src/posting/posting.entity';
import { UserNotFoundException } from 'src/exception/UserNotFound.exception';
import { PostNotFoundException } from 'src/exception/PostNotFound.exception';
import { EmotionDuplicatedException } from 'src/exception/EmotionDuplicated.exception';

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Posting)
    private postingRepository: Repository<Posting>,
  ) {}

  // add
  async addEmotion(user_id: string, post_id: string, emotion_type: number) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });
    const post = await this.postingRepository.findOneBy({
      post_id,
    });

    if (user == null) {
      throw new UserNotFoundException();
    }
    if (post == null) {
      throw new PostNotFoundException();
    }

    const isExist = await this.emotionRepository
      .createQueryBuilder('emotion')
      .leftJoin('emotion.user_id', 'user')
      .leftJoin('emotion.post_id', 'post')
      .where('user.user_id=:user_id', { user_id })
      .andWhere('post.post_id=:post_id', { post_id })
      .getExists();

    if (isExist) throw new EmotionDuplicatedException();

    const emotion = this.emotionRepository.create({
      user_id: user,
      post_id: post,
      emotion_type: emotion_type,
    });

    return await this.emotionRepository.save(emotion);
  }

  //update
  async updateEmotion(emotion_id: string, emotion_type: number) {
    const emotion = await this.emotionRepository.findOneBy({
      emotion_id,
    });

    emotion.emotion_type = emotion_type;

    return await this.emotionRepository.save(emotion);
  }

  //delete
  async deleteEmotion(emotion_id: string) {
    return await this.emotionRepository.delete({ emotion_id });
  }
}
