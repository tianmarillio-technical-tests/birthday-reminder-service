import { Controller } from "@nestjs/common"
import { UserBirthdayService } from "./user-birthday.service"
import { EventPattern } from "@nestjs/microservices"

@Controller("worker-user-birthday")
export class UserBirthdayController {
  constructor(private readonly userBirthdayService: UserBirthdayService) {}

  @EventPattern("birthday_message_sent")
  logUserBirthday(data: Record<string, unknown>): void {
    this.userBirthdayService.logUserBirthday(data.message as string)
  }
}
