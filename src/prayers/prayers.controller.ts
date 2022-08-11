import { Req, SerializeOptions, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer } from './prayer.entity';
import { PrayersService } from './prayers.service';

@Controller('prayers')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class PrayersController {
  constructor(private readonly prayerService: PrayersService) {}

  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPrayerDto: CreatePrayerDto,
    @Req() req: any,
  ): Promise<Prayer> {
    const uid = <string>req.user;
    return this.prayerService.create(createPrayerDto, uid);
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
