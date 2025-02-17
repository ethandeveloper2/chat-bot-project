import { Sentence } from 'src/sentences/entities/sentence.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column("simple-array")
  options: string[];

  @Column()
  correctAnswer: string;

  @ManyToOne(() => Sentence, (sentence) => sentence.questions)
  sentence: Sentence;

  @Column({type: "enum", enum: ["easy", "medium", "hard"]})
  difficulty: "easy" | "medium" | "hard";
}
