import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  @Generated('uuid')
  _uid: string;

  @CreateDateColumn({ name: 'created' }) 'created': Date;

  @UpdateDateColumn({ name: 'updated' }) '_updated': Date;

  @Column('varchar', { length: 100, nullable: false, unique: true })
  userName: string;

  @Column('varchar', { length: 80, default: 'Anonymous' }) firstName: string;

  @Column('varchar', { length: 80, default: '' }) lastName: string;

  @Column('varchar', { length: 80, default: 'Anywhere' }) loacation: string;

  @Column('varchar', { length: 80, default: 'Everywhere' }) country: string;

  @Column({ type: 'int', default: 0 }) submitted: number;

  @Column({ type: 'int', default: 0 }) accepted: number;

  @Column({ default: false }) _isBlacklisted: boolean;

  @Column({ default: false }) _isDeleted: boolean;
}
