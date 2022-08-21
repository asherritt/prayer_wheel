import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Module({
  imports: [HttpModule],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
