import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Prayer {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn({ name: 'created' }) 'created': Date;

  @UpdateDateColumn({ name: 'updated' }) '_updated': Date;

  @Column('varchar', { length: 255, default: '' }) prayerText: string;

  @Column('varchar', { length: 100, default: 'Anonymous' }) displayName: string;

  @Column('varchar', { length: 80, default: 'Anywhere & Everywhere' })
  loacation: string;

  @Column({ type: 'int', default: 0 }) score: number;

  @Column({ default: false }) _isApproved: boolean;

  @Column({ default: false }) _isDeleted: boolean;
}
