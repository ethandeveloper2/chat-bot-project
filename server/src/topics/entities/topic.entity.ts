import { Sentence } from 'src/sentences/entities/sentence.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @OneToMany(() => Sentence, (sentence) => sentence.topic)
  sentences: Sentence[];
}
