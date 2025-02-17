import { Module } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { QuestionController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Sentence } from 'src/sentences/entities/sentence.entity';
import { TopicService } from 'src/topics/topics.service';
import { SentenceService } from 'src/sentences/sentences.service';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Question, Sentence])],
  controllers: [QuestionController],
  providers: [QuestionService, TopicService, SentenceService],
  exports: [QuestionService]
})
export class QuestionModule {}
