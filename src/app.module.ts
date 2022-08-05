import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PrayersModule } from './prayers/prayers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'pw-db.cb9pgwdynjo0.us-east-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'password123',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PrayersModule,
  ],
})
export class AppModule {}
