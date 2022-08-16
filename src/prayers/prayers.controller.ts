import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { AcceptPrayerDto } from './dto/accept-prayer.dto';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer } from './prayer.entity';
import { PrayersService } from './prayers.service';

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
  reportPrayer(
    @Body() acceptPrayerDto: AcceptPrayerDto,
    @Req() req: any,
  ): Promise<Prayer> {
    const uid = <string>req.user;

    return this.prayerService.reportPrayer(uid, acceptPrayerDto.id);
  }
  // ACCEPT PRAYER
  @UseGuards(JwtAuthGuard)
  @Put('/accept')
  async accept(
    @Body() acceptPrayerDto: AcceptPrayerDto,
    @Req() req: any,
  ): Promise<boolean> {
    const uid = <string>req.user;

    await this.prayerService.acceptPrayer(uid, acceptPrayerDto.id);

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
