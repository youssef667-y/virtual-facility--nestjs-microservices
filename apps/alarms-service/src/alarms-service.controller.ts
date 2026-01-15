import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { NATS_MESSAGE_BROKER, NOTIFICATIONS_SERVICE } from './constants';
import { last, lastValueFrom } from 'rxjs';

@Controller()
export class AlarmsServiceController {
  private readonly logger = new Logger(AlarmsServiceController.name);
  constructor(
    @Inject(NATS_MESSAGE_BROKER) private readonly natsMessageBroker: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy, 
  ){}

  @EventPattern('alarm.created')
  async create(@Payload() data: {name: string , buldingId: number}){
    console.log('Received alarm.created event with data:', data);
    this.logger.debug(
      `Received "alarm.created" event with data: ${JSON.stringify(data)}`
    )
    const alarmClassification = await lastValueFrom(
      this.natsMessageBroker.send('alarm.classify' , data),
    );

    this.logger.debug(
      `Alarm "${data.name}" classified as ${alarmClassification.category} `,
    );
    const notify$ = this.notificationsService.send('notification.send' , {
      alarm: data, 
      category: alarmClassification.category,
    });
    await lastValueFrom(notify$);
    this.logger.debug(`Dispatched "notification.send" event`);

  }

  
}
