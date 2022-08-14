import {
  HttpException,
  Patch,
  Put,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
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
import { resolve } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateResult } from 'typeorm';
import { AcceptPrayerDto } from './dto/accept-prayer.dto';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer } from './prayer.entity';
import { PrayersService } from './prayers.service';

@Controller('prayers')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class PrayersController {
  constructor(private readonly prayerService: PrayersService) {}

  // CREATE PRAYER
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
  // GET ALL PRAYERS
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Get()
  findAll(): Promise<Prayer[]> {
    return this.prayerService.findAll();
  }
  // GET RANDOM PRAYER
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/random')
  randomOne(@Req() req: any): Promise<Prayer> {
    const uid = <string>req.user;
    return this.prayerService.findRandom(uid);
  }
  // REPORT PRAYER
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/report')
  reportPrayer(@Req() req: any): Promise<Prayer> {
    // TODO let a user report a prayer, track who reports, track number of reports
    const uid = <string>req.user;
    return this.prayerService.findRandom(uid);
  }
  // ACCEPT PRAYER
  @UseGuards(JwtAuthGuard)
  @Put('/accept')
  accept(@Body() acceptPrayerDto: AcceptPrayerDto): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.prayerService
        .updateScore(acceptPrayerDto.id)
        .then((result) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // GET PRAYER BY ID
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Prayer> {
    return this.prayerService.findOne(id);
  }
  // DELETE PRAYER
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.prayerService.remove(id);
  }
}
