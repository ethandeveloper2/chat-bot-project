export class CreateQuestionDto {
  text: string;
  options: string[];
  correctAnswer: string;
  sentenceId: number; 
  difficulty: "easy" | "medium" | "hard";
}
