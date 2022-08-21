import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Prayer } from './prayer.entity';

@Entity()
@Unique('constraint_report', ['reportedBy', 'prayerBy', 'prayer'])
export class Report {
  @PrimaryGeneratedColumn() _id: number;

  // @OneToOne(() => User)
  // @JoinColumn()
  // reportedBy: User;

  @ManyToOne(() => User)
  reportedBy: User;

  @ManyToOne(() => User)
  prayerBy: User;

  @ManyToOne(() => Prayer)
  prayer: Prayer;

  @CreateDateColumn({ name: 'created' }) '_created': Date;
}
