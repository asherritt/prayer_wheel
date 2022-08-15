import {
  HttpException,
  HttpStatus,
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
import { UsersService } from '../users/users.service';
import { userInfo } from 'os';

@Controller('prayers')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class PrayersController {
  constructor(
    private readonly prayerService: PrayersService,
    private readonly userService: UsersService,
  ) {}

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
  async accept(
    @Body() acceptPrayerDto: AcceptPrayerDto,
    @Req() req: any,
  ): Promise<boolean> {
    const uid = <string>req.user;

    const user = await this.userService.findOneByUID(uid);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    if (!user.isValid()) {
      throw new HttpException('User is disallowed.', HttpStatus.NOT_ACCEPTABLE);
    }

    const prayerDelta = new Date().getTime() - user.lastAcceptance.getTime();

    // const FOUR_HOURS = 14400000; // TODO mover this to settings

    const FOUR_HOURS = 14400; // TODO mover this to settings

    if (prayerDelta < FOUR_HOURS) {
      throw new HttpException(
        'You must wait before you can accept another prayer.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prayerService.updateScore(acceptPrayerDto.id);
    await this.userService.updateAcceptance(uid);

    return true;
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
