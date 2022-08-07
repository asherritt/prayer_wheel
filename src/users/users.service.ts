import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.country = createUserDto.country;
    user.loacation = createUserDto.loacation;
    user.userName = createUserDto.userName;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { _isDeleted: false, _isBlacklisted: false },
    });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({
      id: id,
      _isDeleted: false,
      _isBlacklisted: false,
    });
  }

  findOneByUserName(userName: string): Promise<User> {
    return this.usersRepository.findOneBy({
      userName: userName,
      _isDeleted: false,
      _isBlacklisted: false,
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
