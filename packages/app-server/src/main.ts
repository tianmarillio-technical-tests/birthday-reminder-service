import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const configService = app.get(ConfigService)
  const rabbitMqUrl = configService.get<string>("RABBITMQ_URL")

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: "hbrs_worker_queue",
      queueOptions: {
        durable: false,
      },
    },
  })

  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("Birthday Reminder Service API Documentation")
    .setVersion("1.0")
    .addTag("user")
    .addTag("user-birthday")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api", app, document)

  await app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch((error) => console.error(error))
