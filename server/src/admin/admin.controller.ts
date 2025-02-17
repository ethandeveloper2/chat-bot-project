import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { TopicService } from 'src/topics/topics.service';
import { SentenceService } from 'src/sentences/sentences.service';
import { QuestionService } from 'src/questions/questions.service';
import { AiService } from 'src/ai/ai.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly topicService: TopicService,
    private readonly sentenceService: SentenceService,
    private readonly questionService: QuestionService,
    private readonly AIService: AiService
  ) {}

  @Post('initialize')
  async initializeData() {
    console.log('초기 데이터 삽입 시작');

    await this.topicService.initializeTopics();
    await this.sentenceService.initializeSentences();
    await this.questionService.generateQuestions();

    console.log('초기 데이터 삽입 완료');
    return { message: '초기 데이터 삽입 완료' };
  }

  @Post('generate-basic-sentences')
  async generateBasicSentencesByAi(@Query("topic") topic: string) {
    const response = await this.AIService.generateBasicSentences(topic);

    console.log('response', response)
  }

  // @Post('generate-ai-questions')
  // async generateAIQuestions(@Query("level") level: "low" | "high") {
  //   if (!["low", "high"].includes(level)) {
  //     return { message: "Invalid level parameter. Use 'low' or 'high'."};
  //   }

  //   await this.questionAIService.generateAIQuestions(level);
  //   return { message: `AI-generated ${level} level questions created successfully.` };
  // }

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
