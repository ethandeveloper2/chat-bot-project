import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

interface Sentence {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SentencesResponse {
  data: Sentence[];
}

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateBasicSentences(topic: string): Promise<Sentence[]> {
    const SentenceSchema = z.object({
      text: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
    });
    const SentencesSchema = z.object({ data: z.array(SentenceSchema) });

    const prompt = `Generate 3 English sentences related to the topic: **"${topic}"** for Korean elementary students. 
    Categorize them by difficulty:
    - "easy" (Grades 1-2): Simple words and structure.
    - "medium" (Grades 3-4): Slightly more complex grammar.
    - "hard" (Grades 5-6): Rich vocabulary and varied sentence structure.
    
    Output as JSON:
    [
      { "text": "I see a cat.", "difficulty": "easy" },
      { "text": "Dogs are very friendly pets.", "difficulty": "medium" },
      { "text": "Some wild animals can survive in extreme conditions.", "difficulty": "hard" }
    ]

    Only return the JSON array.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        messages: [{ role: 'system', content: prompt }],
        model: process.env.OPENAI_API_MODEL,
        max_tokens: 100,
        response_format: zodResponseFormat(SentencesSchema, 'generatedText'),
      });

      const generatedText = response.choices[0]?.message?.content;

      if (!generatedText) {
        throw new Error('Failed to generate a review question.');
      }

      const parseSentences: SentencesResponse = JSON.parse(generatedText);
      
      return parseSentences.data;
    } catch (error) {
      console.error('Error generating sentences:', error);
      throw new Error('Sentence generation failed.');
    }
  }

  async generateReviewQuestion(
    sentence: string,
  ): Promise<{ question: string; answer: string }> {
    const prompt = `
    Given the sentence: "${sentence}", create a simpler version of it with a fill-in-the-blank format. 
    Provide the correct answer separately. Keep it suitable for beginner-level students.
  `;

    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: process.env.OPENAI_API_MODEL,
      max_tokens: 100,
    });

    const generatedText = response.choices[0].message?.content.trim();

    if (!generatedText) {
      throw new Error('Failed to generate a review question.');
    }

    const [question, answer] = generatedText.split('\n');
    return { question, answer };
  }

  async generateAdvancedQuestion(
    sentence: string,
  ): Promise<{ question: string; answer: string }> {
    const prompt = `
    Given the sentence: "${sentence}", transform it into a more complex version with a fill-in-the-blank format. 
    Provide the correct answer separately. Keep it challenging for advanced students.
  `;

    const response = await this.openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: process.env.OPENAI_API_MODEL,
      max_tokens: 100,
    });

    const generatedText = response.choices[0].message?.content.trim();

    if (!generatedText) {
      throw new Error('Failed to generate an advanced question.');
    }

    const [question, answer] = generatedText.split('\n');
    return { question, answer };
  }

  // async generateAIQuestions(studentLevel: "low" | "high") {
  //   console.log(`✅ AI 기반 ${studentLevel} 난이도 문제 생성 시작!`);
  //   const sentences = await this.sentenceRepository.find();

  //   for (const sentence of sentences) {
  //     let generatedData;

  //     if (studentLevel === "low") {
  //       generatedData = await this.aiService.generateReviewQuestion(sentence.text);
  //     } else {
  //       generatedData = await this.aiService.generateAdvancedQuestion(sentence.text);
  //     }

  //     const options = this.generateOptions(generatedData.answer, studentLevel);

  //     const newQuestion = this.questionRepository.create({
  //       text: generatedData.question,
  //       options: options,
  //       correctAnswer: generatedData.answer,
  //       sentence: sentence,
  //       difficulty: studentLevel === "low" ? "easy" : "hard"
  //     });

  //     await this.questionRepository.save(newQuestion);

  //     console.log(`✅ AI 기반 ${studentLevel} 난이도 문제 생성 완료!`);
  //   }
  // }

  // private generateOptions(correctAnswer: string, level: "low" | "high"): string[]{
  //   const similarWords = {
  //     "doctor": ["teacher", "nurse", "engineer", "farmer"],
  //     "store": ["mall", "shop", "market", "supermarket"],
  //     "pizza": ["pasta", "burger", "sandwich", "salad"],
  //     "happy": ["excited", "joyful", "pleased", "cheerful"]
  //   };

  //   let options = [correctAnswer];

  //   if (similarWords[correctAnswer]) {
  //     let shuffledOptions = similarWords[correctAnswer].sort(() => 0.5 - Math.random());
  //     options.push(...shuffledOptions.slice(0, 4));
  //   } else {
  //     while (options.length < 5) {
  //       options.push(correctAnswer.split("").sort(() => Math.random() - 0.5).join(""));
  //     }
  //   }
  //   return options.sort(() => Math.random() - 0.5);
  // }
}
