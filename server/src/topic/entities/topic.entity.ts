import { Sentence } from 'src/sentence/entities/sentence.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @OneToMany(() => Sentence, (sentence) => sentence.topic)
  sentences: Sentence[];
}
