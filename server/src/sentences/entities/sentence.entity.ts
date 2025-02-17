import { Question } from 'src/questions/entities/question.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('sentences')
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
