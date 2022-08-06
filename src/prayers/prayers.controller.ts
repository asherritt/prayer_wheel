import { SerializeOptions } from '@nestjs/common';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer } from './prayer.entity';
import { PrayersService } from './prayers.service';

@Controller('prayers')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class PrayersController {
  constructor(private readonly prayerService: PrayersService) {}

  @Post()
  create(@Body() createPrayerDto: CreatePrayerDto): Promise<Prayer> {
    const userUUID = ''; // TODO get user uuid from header or JWT
    return this.prayerService.create(createPrayerDto, userUUID);
  }

  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Get()
  findAll(): Promise<Prayer[]> {
    return this.prayerService.findAll();
  }

  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Prayer> {
    return this.prayerService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.prayerService.remove(id);
  }
}
