import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AlarmClassifierServiceModule } from "./alarm-classifier-service.module";

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice(AlarmClassifierServiceModule, {
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL || "nats://nats:4222"],
    },
  });

  // ✅ THIS keeps the process alive and activates the scheduler
  await app.listen();

  console.log("✅ Alarms classifier service is running in background...");
}
bootstrap();
