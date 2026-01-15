import { Controller, Get, Logger } from '@nestjs/common';
import { AlarmClassifierServiceService } from './alarm-classifier-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AlarmClassifierServiceController {
  private readonly logger = new Logger(AlarmClassifierServiceController.name);
  @MessagePattern('alarm.classify')
  classifyAlarm(@Payload() data: unknown) {
    try{
    console.log('Classifying alarm with data:', data);
    this.logger.debug(
      `Recived new "alarm.classify" message with data: ${JSON.stringify(data)}`,
    );
    return {
      category : ['critical' , 'non-critical' , 'invalid'][Math.floor(Math.random() * 3)],
    }
  }  catch (err){
    this.logger.error('Error classifying alarm', err);
  }
}
}
