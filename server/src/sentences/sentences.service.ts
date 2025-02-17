import { Injectable } from '@nestjs/common';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { UpdateSentenceDto } from './dto/update-sentence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { Repository } from 'typeorm';
import { Topic } from 'src/topics/entities/topic.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>
  ) {}

  async initializeSentences() {
    console.log("✅ 학습 문장 데이터 삽입 시작!");
    const topics = await this.topicRepository.find();

    const exampleSentences = {
      "일상 표현": [
      { text: "Hello, how are you?", difficulty: "easy" },
      { text: "I am going to the store.", difficulty: "medium" },
      { text: "Can you help me with this problem?", difficulty: "hard" }
      ],
      "가족": [
        { text: "My father is a doctor.", difficulty: "easy" },
        { text: "I have an older brother and a younger sister.", difficulty: "medium" },
        { text: "My grandparents live in the countryside.", difficulty: "hard" }
      ],
      "음식": [
        { text: "I like pizza.", difficulty: "easy" },
        { text: "Spaghetti is my favorite dish.", difficulty: "medium" },
        { text: "This restaurant serves delicious seafood.", difficulty: "hard" }
      ],
      "학교 생활": [
        { text: "I go to school every day.", difficulty: "easy" },
        { text: "We have math and science classes in the morning.", difficulty: "medium" },
        { text: "Our school has a big library with many books.", difficulty: "hard" }
      ],
      "감정 표현": [
        { text: "I am happy today.", difficulty: "easy" },
        { text: "She felt excited before the competition.", difficulty: "medium" },
        { text: "He was disappointed with the test results.", difficulty: "hard" }
      ]
    }

    for (const topic of topics) {
      for (const sentenceData of exampleSentences[topic.name]) {
        const exists = await this.sentenceRepository.findOne({where: {text: sentenceData.text}});
        if (!exists) {
          const sentence = this.sentenceRepository.create({
            text: sentenceData.text,
            difficulty: sentenceData.difficulty,
            topic: topic
          })
          await this.sentenceRepository.save(sentence);
        }
      }
    }
    console.log("✅ 학습 문장 데이터 삽입 완료!");
  }

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
