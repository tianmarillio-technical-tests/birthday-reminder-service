import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { RabbitmqService } from "./rabbitmq.service"

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: "RABBITMQ_SERVICE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>("RABBITMQ_URL")],
            queue: "hbrs_app_server_queue",
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [RabbitmqService],
  exports: [ClientsModule],
})
export class RabbitmqModule {}
