import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class NotificationsServiceController {
  private readonly logger = new Logger(NotificationsServiceController.name);

  @MessagePattern('notification.send')
  sendNotification(@Payload() data: unknown, @Ctx() context: RmqContext) {
    this.logger.debug(
      `sending notification about the alarm : ${JSON.stringify(data)}`,
    )
    
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    if(originalMsg.fields.redelivered){
      this.logger.verbose(
        `Message was already redelivered. Acknowledging the message and discarding it.`,

      );
      return channel.ack(originalMsg);
    }
    channel.nack(originalMsg);
  }
}
