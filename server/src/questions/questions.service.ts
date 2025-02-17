import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sentence } from 'src/sentences/entities/sentence.entity';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>
  ){

  }
  // 랜덤 단어 제거 함수
  generateFillInTheBlank(sentence: string, difficulty: "easy" | "medium" | "hard"):{ question: string, answer: string } {
    console.log('sentence', sentence)
    const words = sentence.split(' ');

    let blankIndex: number;
    if (difficulty === 'easy') {
      blankIndex = words.findIndex(word => word.length > 3); // 짧은 단어 피하기
    } else if (difficulty === 'medium') {
      blankIndex = Math.floor(words.length / 2); // 중간 단어 선택
    } else {
      blankIndex = words.length - 1; // 마지막 단어 선택
    }

    const answer = words[blankIndex];
    words[blankIndex] = "______"

    return {question: words.join(' '), answer};
  }

  // 객관식 옵션 생성 함수
  generateOptions(correctAnswer: string, difficulty: "easy" | "medium" | "hard") : string[] {
    const similarWords = {
      "doctor": ["teacher", "nurse", "engineer", "farmer"],
      "store": ["mall", "shop", "market", "supermarket"],
      "pizza": ["pasta", "burger", "sandwich", "salad"],
      "happy": ["excited", "joyful", "pleased", "cheerful"]
    }
    let options = [correctAnswer];

    if (similarWords[correctAnswer]) {
      let shuffledOptions = similarWords[correctAnswer].sort(() => 0.5 - Math.random());
      options.push(...shuffledOptions.slice(0, 4));
    } else {
      while (options.length < 5) {
        options.push(correctAnswer.split('').sort(() => Math.random() - 0.5).join(''));
      }
    }
    return options.sort(() => Math.random() - 0.5); // 랜덤 정렬
  }

  async generateQuestions() {
    const sentences = await this.sentenceRepository.find();

    for (const sentence of sentences) {
      const {question, answer} = this.generateFillInTheBlank(sentence.text, sentence.difficulty);
      console.log('answer', answer);
      console.log('question', question);
      const options = this.generateOptions(answer, sentence.difficulty);

      const exists = await this.questionRepository.findOne({where: {text:question}});
      if (!exists) {
        const newQuestion = this.questionRepository.create({
          text: question,
          options: options,
          correctAnswer: answer,
          sentence: sentence,
          difficulty: sentence.difficulty
        });
        await this.questionRepository.save(newQuestion);
      }
    }
  }


  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
