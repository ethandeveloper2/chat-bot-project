import { Question } from 'src/question/entities/question.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Sentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({type: "enum", enum: ["easy", "medium", "hard"]})
  difficulty: "easy" | "medium" | "hard";

  @ManyToOne(() => Topic, (topic) => topic.sentences)
  topic: Topic;

  @OneToMany(() => Question, (question) => question.sentence)
  questions: Question[];
}
