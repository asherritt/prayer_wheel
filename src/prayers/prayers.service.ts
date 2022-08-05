import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer } from './prayer.entity';

@Injectable()
export class PrayersService {
  constructor(
    @InjectRepository(Prayer)
    private readonly prayerRepository: Repository<Prayer>,
  ) {}

  create(createPrayerDto: CreatePrayerDto): Promise<Prayer> {
    const prayer = new Prayer();
    prayer.displayName = createPrayerDto.displayName;
    prayer.prayerText = createPrayerDto.prayerText;

    return this.prayerRepository.save(prayer);
  }

  async findAll(): Promise<Prayer[]> {
    return this.prayerRepository.find({
      relations: {
        user: true,
      },
    });
  }

  findOne(id: number): Promise<Prayer> {
    return this.prayerRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.prayerRepository.delete(id);
  }
}
