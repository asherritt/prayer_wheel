import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';

// TODO Remove this. Moderation will happen in Lambda
@Module({
  imports: [HttpModule],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
