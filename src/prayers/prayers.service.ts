import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ModerationService } from 'src/moderation/moderation.service';
import { Repository, Not, UpdateResult, MoreThan } from 'typeorm';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { Prayer, PrayerStatus } from './prayer.entity';
import { Report } from './report.entity';

@Injectable()
export class PrayersService {
  private readonly logger = new Logger(PrayersService.name);
  constructor(
    @InjectRepository(Prayer)
    private readonly prayerRepository: Repository<Prayer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(
    createPrayerDto: CreatePrayerDto,
    userUUID: string,
  ): Promise<Prayer> {
    const user = await this.userRepository.findOneBy({ _uid: userUUID });

    this.logger.log(`create for uid: ${userUUID}`);

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
    this.logger.log(`findAll`);

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

  async updateScore(id: number): Promise<any> {
    this.logger.log(`updateScore for prayer.id: ${id}`);

    const prayer = await this.prayerRepository.findOneBy({ id: id });

    if (!prayer) {
      throw new HttpException('Prayer not found.', HttpStatus.NOT_FOUND);
    }

    prayer.score++;
    return this.prayerRepository.save(prayer);
  }

  async findRandom(uid): Promise<Prayer> {
    // TODO figure out a way of not having to query for user here
    // TODO could use prayer._uid
    const user = await this.userRepository.findOneBy({ _uid: uid });

    if (!user) {
      // This shouldn't happen, but this might be considered a 500 error too.
      throw new HttpException(
        'Your username could not be found.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Select a radnom prayer weighted towards prayers with lower scores
    // and omitting any prayers made by the logged in user.
    return this.prayerRepository
      .createQueryBuilder('prayer')
      .where('prayer.user_id != :uid', { uid: user._id })
      .andWhere({ _isDeleted: false, _status: PrayerStatus.APPROVED })
      .orderBy('score', 'ASC')
      .take(10)
      .orderBy('RAND()')
      .limit(1)
      .getOne();
  }

  async incermentScore(id: number): Promise<Prayer> {
    this.logger.log(`incermentScore for prayer.id: ${id}`);

    const prayer = await this.prayerRepository.findOneBy({ id: id });

    if (!prayer) {
      throw new HttpException('Prayer not found.', HttpStatus.NOT_FOUND);
    }

    prayer.score++;
    return await this.prayerRepository.save(prayer);
  }

  async acceptPrayer(uid: string, prayerID: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ _uid: uid });

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

    await this.updateScore(prayerID);

    user.accepted++;
    user.lastAcceptance = new Date();

    return await this.userRepository.save(user);
  }

  async reportPrayer(uid: string, prayerID: number): Promise<Report> {
    this.logger.log(
      `reportPrayer for prayer.id: ${prayerID} by user.uid: ${uid}`,
    );

    const MAX_REPORT_COUNT = 3; // TODO move this to settings

    const PRAYER_REPORTS_THRESHOLD = 2; // TODO move this to settings

    // Get Reported Prayer with the creating user and the Reporting User
    const reportedPrayer = await this.prayerRepository.findOne({
      where: { id: prayerID },
      relations: {
        user: true,
      },
    });
    const reportedBy = await this.userRepository.findOneBy({ _uid: uid });

    // Query the number of reports the reporting user has made during the threshold time
    const today = new Date();
    const yesterday = today.setDate(today.getDate() - 5); // TODO move this to settings
    const reportsTotal: number = await this.reportRepository
      .createQueryBuilder()
      .select('_id')
      .where({
        reportedBy: reportedBy,
        _created: MoreThan(yesterday),
      })
      .getCount();

    if (reportsTotal > MAX_REPORT_COUNT) {
      throw new HttpException(
        'Maximum reports exceeded.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // save Report object
    const report = new Report();
    report.prayer = reportedPrayer;
    report.reportedBy = reportedBy;
    report.prayerBy = reportedPrayer.user;

    const countExistingReport = await this.reportRepository
      .createQueryBuilder()
      .select('_id')
      .where({
        prayer: report.prayer,
        reportedBy: report.reportedBy,
        prayerBy: reportedPrayer.user,
      })
      .getCount();

    if (countExistingReport == 0) {
      await this.reportRepository.save(report);
    }

    const prayerReportCount = await this.reportRepository
      .createQueryBuilder()
      .select('_id')
      .where({ prayer: report.prayer })
      .getCount();

    if (prayerReportCount >= PRAYER_REPORTS_THRESHOLD) {
      // This prayer has been reported too many times
      // Mark the prayer as rejected
      report.prayer._status = PrayerStatus.FLAGGED;
      this.prayerRepository.save(report.prayer);
      // Blacklist the user tha submitted the prayer
      reportedPrayer.user._isBlacklisted = true;
      this.userRepository.save(reportedPrayer.user);
    }

    return report;
  }

  async remove(id: string): Promise<void> {
    await this.prayerRepository.delete(id);
  }
}
