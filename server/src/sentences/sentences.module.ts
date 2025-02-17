import { Module } from '@nestjs/common';
import { SentenceService } from './sentences.service';
import { SentenceController } from './sentences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sentence } from './entities/sentence.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sentence, Topic])],
  controllers: [SentenceController],
  providers: [SentenceService],
  exports: [SentenceService]
})
export class SentenceModule {}
