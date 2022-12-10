import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from './emotion.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Posting } from 'src/posting/posting.entity';
import { UserNotFoundException } from 'src/exception/UserNotFound.exception';
import { PostNotFoundException } from 'src/exception/PostNotFound.exception';

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private EmotionRepository: Repository<Emotion>,

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
    const post = await this.postingRepository.findOne({
      relations: {
        user_id: true,
      },
      where: {
        post_id,
      },
    });

    if (user == null) {
      throw new UserNotFoundException();
    }
    if (post == null) {
      throw new PostNotFoundException();
    }

    const em = this.EmotionRepository.create({
      user_id: user,
      post_id: post,
      emotion_type: emotion_type,
    });

    return await this.EmotionRepository.save(em);
  }

  //update
  async updateEmotion(emotion_id: string, emotion_type: number) {
    const emotion = await this.EmotionRepository.findOneBy({
      emotion_id,
    });

    emotion.emotion_type = emotion_type;

    return await this.EmotionRepository.save(emotion);
  }

  //delete
  async deleteEmotion(emotion_id: string) {
    return await this.EmotionRepository.delete({ emotion_id });
  }
}
