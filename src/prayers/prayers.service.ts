import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
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

  async remove(id: string): Promise<void> {
    await this.prayerRepository.delete(id);
  }
}
