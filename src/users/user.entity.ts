import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn() _id: number;

  @Column()
  @Generated('uuid')
  _uid: string;

  @CreateDateColumn({ name: 'created' }) 'created': Date;

  @UpdateDateColumn({ name: 'updated' }) '_updated': Date;

  @Column('varchar', { length: 100, nullable: false, unique: true })
  userName: string;

  @Column('varchar', { length: 200, nullable: false }) _password: string;

  @Column('varchar', { length: 80, default: 'Anonymous' }) firstName: string;

  @Column('varchar', { length: 80, default: '' }) lastName: string;

  @Column('varchar', { length: 80, default: 'Anywhere' }) loacation: string;

  @Column('varchar', { length: 80, default: 'Everywhere' }) country: string;

  @Column({ type: 'int', default: 0 }) submitted: number;

  @Column({ type: 'int', default: 0 }) accepted: number;

  @Column({ default: false }) _isBlacklisted: boolean;

  @Column({ default: false }) _isDeleted: boolean;

  public isValid(): boolean {
    return this._isDeleted == false && this._isBlacklisted == false;
  }

  @BeforeInsert()
  async hashPassword() {
    // TODO put salt in Env variable
    this._password = await bcrypt.hash(this._password, 10);
  }

  public passwordIsValid(rawPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, this._password);
  }
}
