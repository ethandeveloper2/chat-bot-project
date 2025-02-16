export class CreateSentenceDto {
  text: string;
  topicId: number;
  difficulty: "easy" | "medium" | "hard";
}
