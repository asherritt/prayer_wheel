import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn({ name: 'created' }) 'created': Date;

  @UpdateDateColumn({ name: 'updated' }) 'updated': Date;

  @Column('varchar', { length: 100 }) userName: string;

  @Column('varchar', { length: 80, default: 'Anonymous' }) firstName: string;

  @Column('varchar', { length: 80, default: '' }) lastName: string;

  @Column('varchar', { length: 80, default: 'Anywhere' }) loacation: string;

  @Column('varchar', { length: 80, default: 'Everywhere' }) country: string;

  @Column({ type: 'int', default: 0 }) submitted: number;

  @Column({ type: 'int', default: 0 }) accepted: number;

  @Column({ default: false }) isBlacklisted: boolean;

  @Column({ default: false }) isDeleted: boolean;
}
