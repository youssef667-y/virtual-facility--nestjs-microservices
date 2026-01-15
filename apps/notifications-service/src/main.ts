import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { NotificationsServiceModule } from "./notifications-service.module";

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice(NotificationsServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.NOTIFICATIONS_QUEUE || 'notifications_queue',
      queueOptions: {
        durable: false,
      },
      noAck: false,
    },
  });

  // ✅ THIS keeps the process alive and activates the scheduler
  await app.listen();

  console.log("✅ Notifications service is running in background...");
}
bootstrap();
