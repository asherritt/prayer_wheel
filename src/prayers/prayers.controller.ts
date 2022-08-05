import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer } from './prayer.entity';
import { PrayersService } from './prayers.service';

@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayerService: PrayersService) {}

  @Post()
  create(@Body() createPrayerDto: CreatePrayerDto): Promise<Prayer> {
    return this.prayerService.create(createPrayerDto);
  }

  @Get()
  findAll(): Promise<Prayer[]> {
    return this.prayerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Prayer> {
    return this.prayerService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.prayerService.remove(id);
  }
}
