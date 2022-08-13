import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository, Not } from 'typeorm';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer, PrayerStatus } from './prayer.entity';

@Injectable()
export class PrayersService {
  constructor(
    @InjectRepository(Prayer)
    private readonly prayerRepository: Repository<Prayer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createPrayerDto: CreatePrayerDto,
    userUUID: string,
  ): Promise<Prayer> {
    const user = await this.userRepository.findOneBy({ _uid: userUUID });

    if (user?.isValid()) {
      const prayer = new Prayer();
      prayer.displayName = createPrayerDto.displayName;
      prayer.prayerText = createPrayerDto.prayerText;
      prayer.loacation = createPrayerDto.location;
      prayer.user = user;

      return this.prayerRepository.save(prayer);
    } else {
      throw new UnauthorizedException();
    }
  }

  async findAll(): Promise<Prayer[]> {
    return this.prayerRepository.find({
      relations: {
        user: true,
      },
      where: { _isDeleted: false, _status: PrayerStatus.PENDING },
    });
  }

  findOne(id: number): Promise<Prayer> {
    return this.prayerRepository.findOneBy({ id: id });
  }

  async findRandom(uid): Promise<Prayer> {
    // TODO figure out a way of not having to query for user here
    // TODO could use prayer._uid
    const user = await this.userRepository.findOneBy({ _uid: uid });

    if (!user) {
      // This shouldn't happen, but this might be considered a 500 error too.
      throw new HttpException(
        'Your username could not be found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Select a radnom prayer weighted towards prayers with lower scores
    // and omitting any prayers made by the logged in user.
    return this.prayerRepository
      .createQueryBuilder('prayer')
      .where('prayer.user_id != :uid', { uid: user._id })
      .andWhere({ _isDeleted: false, _status: PrayerStatus.APPROVED })
      .orderBy('score', 'ASC')
      .take(10)
      .orderBy('RAND()')
      .limit(1)
      .getOne();
  }

  async remove(id: string): Promise<void> {
    await this.prayerRepository.delete(id);
  }
}
