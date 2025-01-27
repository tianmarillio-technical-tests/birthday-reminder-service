import { Controller, Post } from "@nestjs/common"
import { UserBirthdayService } from "./user-birthday.service"
import { ApiTags } from "@nestjs/swagger"
import { EventPattern } from "@nestjs/microservices"

@ApiTags("user-birthday")
@Controller("user-birthday")
export class UserBirthdayController {
  constructor(private readonly userBirthdayService: UserBirthdayService) {}

  @Post()
  @EventPattern("birthday_cron_triggered")
  async checkAndSendBirthdayMessages() {
    await this.userBirthdayService.checkAndSendBirthdayMessages()
  }
}
