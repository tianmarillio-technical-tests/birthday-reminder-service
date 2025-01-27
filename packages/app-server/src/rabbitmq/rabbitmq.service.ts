import { Injectable, OnModuleInit } from "@nestjs/common"
import { Inject, OnModuleDestroy } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject("RABBITMQ_SERVICE") private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    console.log("Connecting to RabbitMQ...")
    await this.client.connect()
    console.log("Connected to RabbitMQ")
  }

  async onModuleDestroy() {
    await this.client.close()
  }
}
