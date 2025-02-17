import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/topics/entities/topic.entity';
import { Sentence } from 'src/sentences/entities/sentence.entity';
import { Question } from 'src/questions/entities/question.entity';
import { TopicModule } from 'src/topics/topics.module';
import { SentenceModule } from 'src/sentences/sentences.module';
import { QuestionModule } from 'src/questions/questions.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, Sentence, Question]),
    TopicModule,
    SentenceModule,
    QuestionModule,
    AiModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
