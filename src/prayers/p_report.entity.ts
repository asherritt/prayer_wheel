import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prayer } from './prayer.entity';

@Entity()
export class PReport {
  @PrimaryGeneratedColumn() _id: number;

  @OneToOne(() => User)
  @JoinColumn()
  reportedBy: User;

  @OneToOne(() => User)
  @JoinColumn()
  prayerBy: User;

  @OneToOne(() => Prayer)
  @JoinColumn()
  prayer: Prayer;

  @CreateDateColumn({ name: 'created' }) '_created': Date;
}
