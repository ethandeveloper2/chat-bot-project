import { Injectable } from '@nestjs/common';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { Repository } from 'typeorm';
import { Topic } from 'src/topic/entities/topic.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>
  ) {}

  async createSentence(createSentenceDto: CreateSentenceDto): Promise<Sentence> {
    const topic = await this.topicRepository.findOne({
      where: {id: createSentenceDto.topicId},
    });
    if (!topic) throw new Error("Topic not found");

    const sentence = this.sentenceRepository.create({
      text: createSentenceDto.text,
      difficulty: createSentenceDto.difficulty,
      topic: topic
    });
    
    return await this.sentenceRepository.save(sentence);
  }

  findAll() {
    return `This action returns all sentence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sentence`;
  }

  update(id: number, updateSentenceDto: UpdateSentenceDto) {
    return `This action updates a #${id} sentence`;
  }

  remove(id: number) {
    return `This action removes a #${id} sentence`;
  }
}
