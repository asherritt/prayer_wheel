import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    newUser.country = createUserDto.country;
    newUser.loacation = createUserDto.loacation;
    newUser.userName = createUserDto.userName;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser._password = createUserDto.password;
    const existingUser = await this.usersRepository.findOneBy({
      userName: createUserDto.userName,
    });

    if (existingUser) {
      throw new HttpException(
        'Username already exists.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.usersRepository.save(newUser);
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { _isDeleted: false, _isBlacklisted: false },
    });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({
      _id: id,
      _isDeleted: false,
      _isBlacklisted: false,
    });
  }

  /**
   * Find one valid user (_isDeleted, _isBlacklisted: false) by username
   * @param userName
   * @returns
   */
  findValidUserByUserName(userName: string): Promise<User> {
    return this.usersRepository.findOneBy({
      userName: userName,
      _isDeleted: false,
      _isBlacklisted: false,
    });
  }

  findOneByUID(uid: string): Promise<User> {
    return this.usersRepository.findOneBy({ _uid: uid });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
