import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AlarmsGeneratorService } from './alarms-generator.service';
import { ALARMS_SERVICE } from './constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: ALARMS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://nats:4222'],
        }
      }
    ])
  ],
  providers: [AlarmsGeneratorService],
})
export class AlarmsGeneratorModule {}
