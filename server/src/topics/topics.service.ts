import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>
  ) {}

  async createTopic(createTopicDto: CreateTopicDto) : Promise<Topic> {
    const topic = this.topicRepository.create(createTopicDto);
    return await this.topicRepository.save(topic);
  }

  async getAllTopics(): Promise<Topic[]> {
    return await this.topicRepository.find();
  }

  async initializeTopics() {
    const topics = ['일상 표현', '가족', '음식', '학교 생활', '감정 표현'];

    for (const topicName of topics) {
      const exist = await this.topicRepository.findOne({where: {name: topicName}});
      if (!exist) {
        const topic = this.topicRepository.create({name: topicName});
        await this.topicRepository.save(topic);
      }
    }
    console.log("학습 주제 데이터 삽입 완료!")
  }

  findOne(id: number) {
    return `This action returns a #${id} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
