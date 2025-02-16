import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

@Injectable()
export class AiService {
  private readonly model;
  private readonly agent;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    // OpenAI 모델 초기화
    this.model = new ChatOpenAI({
      model: "gpt-4o",
      apiKey: process.env.OPENAI_API_KEY
    });

    // 날씨 정보를 가져오는 툴 정의
    const getWeather = tool((input) => {
      this.logger.log(`getWeather tool called with input: ${JSON.stringify(input)}`);

      if (["sf", "san francisco"].includes(input.location.toLowerCase())) {
        return "It's 60 degrees and foggy.";
      } else {
        return "It's 90 degrees and sunny.";
      }
    }, {
      name: "get_weather",
      description: "Call to get the current weather.",
      schema: z.object({
        location: z.string().describe("Location to get the weather for."),
      }),
    });

    // LangGraph 에이전트 생성
    this.agent = createReactAgent({ llm: this.model, tools: [getWeather] });
  }

  // 날씨 정보를 가져오는 메서드
  async getWeatherForLocation(location: string): Promise<string> {
    this.logger.log(`Request received for location: ${location}`);

    const inputs = {
      messages: [{ role: "user", content: `What is the weather in ${location}?` }],
    };

    try {
      // LangGraph 에이전트 실행
      const stream = await this.agent.stream(inputs, { streamMode: "values" });

      let responseMessages: string[] = [];

      for await (const { messages } of stream) {
        this.logger.log(`Received message chunk: ${JSON.stringify(messages)}\n`);

        if (messages && messages.length > 0) {
          responseMessages.push(...messages.map((msg) => msg.content));
        }
      }

      // 최종 응답 조합
      const finalResponse = responseMessages.join("\n") || "No response from AI.";
      this.logger.log(`Final response: ${finalResponse}`);

      return finalResponse;
    } catch (error) {
      this.logger.error(`Error in getWeatherForLocation: ${error.message}`, error.stack);
      return "An error occurred while fetching the weather.";
    }
  }
}