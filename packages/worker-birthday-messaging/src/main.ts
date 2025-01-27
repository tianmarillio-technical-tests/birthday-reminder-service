import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const rabbitMqUrl = configService.get<string>("RABBITMQ_URL")!

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: "hbrs_app_server_queue",
      queueOptions: {
        durable: false,
      },
    },
  })

  await app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch((error) => console.error(error))
