import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { UserBirthdayService } from "src/modules/user/user-birthday.service"

@Injectable()
export class TaskSchedulerService {
  constructor(private readonly userBirthdayService: UserBirthdayService) {}

  /**
   * Runs every XX:00, XX:30, and XX:45 marks,
   * to also handle non-standard GMT offsets such as:
   * GMT+09:30 - Australian Central Standard Time (ACST)
   * GMT+05:45 - Nepal Time (NPT)
   */
  @Cron("0,30,45 * * * *")
  sendBirthdayMessages() {
    console.log("JOB START: Sending birthday messages.")

    this.userBirthdayService.triggerBirthdayCron()

    console.log("JOB END: Sending birthday messages.")
  }
}
