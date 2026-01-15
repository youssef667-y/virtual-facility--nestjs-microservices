import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { Outbox } from './entities/outbox.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WORKFLOWS_SERVICE } from '../constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OutboxProcessor } from './outbox.processor';
import { OutboxEntitySubscriber } from './outbox.entity-subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outbox]),
    ClientsModule.register([
      {
        name: WORKFLOWS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: 'workflows_service',
        }
      }
    ])
  ],
  providers: [OutboxService , OutboxProcessor , OutboxEntitySubscriber],
})
export class OutboxModule {}
