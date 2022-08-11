import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prayer } from './prayer.entity';
import { PrayersController } from './prayers.controller';
import { PrayersService } from './prayers.service';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prayer]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [PrayersService],
  controllers: [PrayersController],
})
export class PrayersModule {}
