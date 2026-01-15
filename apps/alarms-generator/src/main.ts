import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AlarmsGeneratorModule } from "./alarms-generator.module";

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice(AlarmsGeneratorModule, {
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL || "nats://nats:4222"],
    },
  });

  // ✅ THIS keeps the process alive and activates the scheduler
  await app.listen();

  console.log("✅ Alarms generator is running in background...");
}
bootstrap();
