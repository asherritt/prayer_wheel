import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrayersModule } from './prayers/prayers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prayer } from './prayers/prayer.entity';
import { Report } from './prayers/report.entity';
import { User } from './users/user.entity';
import { ModerationModule } from './moderation/moderation.module';

// TODO Remove this. Moderation will happen in Lambda

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: configService.get('AUTO_LOAD_ENTITIES'),
        synchronize: configService.get('DB_SYNCHRONIZE'),
        entities: [User, Prayer, Report],
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PrayersModule,
    AuthModule,
    ModerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
