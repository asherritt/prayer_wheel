import {
  AfterLoad,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

import CryptoUtil from '../util/crypto.util';

import * as bcrypt from 'bcrypt';
import { util } from 'prettier';

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

  @Column('varchar', { length: 100, nullable: false }) _email: string;

  @Column('varchar', { length: 100, nullable: false }) _phone: string;

  @Column({ default: false }) emailEnabled: boolean;

  @Column({ default: false }) phoneEnabled: boolean;

  @Column('varchar', { length: 80, default: 'Anonymous' }) firstName: string;

  @Column('varchar', { length: 80, default: '' }) lastName: string;

  @Column('varchar', { length: 80, default: 'Anywhere' }) loacation: string;

  @Column('varchar', { length: 80, default: 'Everywhere' }) country: string;

  @Column({ type: 'int', default: 0 }) submitted: number;

  @Column({ type: 'int', default: 0 }) accepted: number;

  @Column({ type: 'datetime', default: null }) lastAcceptance: Date;

  @Column({ default: false }) _isBlacklisted: boolean;

  @Column({ default: false }) _isDeleted: boolean;

  public isValid(): boolean {
    return this._isDeleted == false && this._isBlacklisted == false;
  }

  @BeforeInsert()
  async hashPassword() {

    this._password = await bcrypt.hash(this._password, 10);

    const c = new CryptoUtil();

    this._email = c.encrypt(this._email);

    this._phone = c.encrypt(this._phone);

  }

  public passwordIsValid(rawPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, this._password);
  }

  @AfterLoad()
  decryptFields() {

    const c = new CryptoUtil();

    this._email = c.decrypt(this._email);

    this._phone = c.decrypt(this._phone);

  }
}
