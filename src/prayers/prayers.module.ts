import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prayer } from './prayer.entity';
import { PrayersController } from './prayers.controller';
import { PrayersService } from './prayers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prayer])],
  providers: [PrayersService],
  controllers: [PrayersController],
})
export class PrayersModule {}
