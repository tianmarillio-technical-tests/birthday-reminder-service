import { Inject, Injectable } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"

@Injectable()
export class UserBirthdayService {
  constructor(
    @Inject("RABBITMQ_SERVICE") private readonly mqClient: ClientProxy,
  ) {}

  triggerBirthdayCron(): void {
    this.mqClient.emit("birthday_cron_triggered", {})
  }

  logUserBirthday(message: string): void {
    console.log(message)
  }
}
