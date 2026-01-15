import { Module } from '@nestjs/common';
import { AlarmClassifierServiceController } from './alarm-classifier-service.controller';
import { AlarmClassifierServiceService } from './alarm-classifier-service.service';

@Module({
  imports: [],
  controllers: [AlarmClassifierServiceController],
  providers: [AlarmClassifierServiceService],
})
export class AlarmClassifierServiceModule {}
