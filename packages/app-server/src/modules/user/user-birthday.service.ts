import { Inject, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { Model } from "mongoose"
import { DateTimeUtils } from "src/utils/date-time/date-time.utils"
import { ClientProxy } from "@nestjs/microservices"

@Injectable()
export class UserBirthdayService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly dateTimeUtils: DateTimeUtils,
    @Inject("RABBITMQ_SERVICE") private readonly mqClient: ClientProxy,
  ) {}

  async checkAndSendBirthdayMessages(): Promise<void> {
    const nowUtc = this.dateTimeUtils.getNowUtc()

    const users: UserDocument[] = await this.userModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          birthday: 1,
          timezone: 1,
          month: { $month: "$birthday" },
          day: { $dayOfMonth: "$birthday" },
          hour: { $hour: "$birthday" },
          minute: { $minute: "$birthday" },
        },
      },
      {
        $match: {
          month: nowUtc.month,
          day: nowUtc.day,
          hour: nowUtc.hour,
          minute: nowUtc.minute,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          birthday: 1,
          timezone: 1,
        },
      },
    ])

    for (const user of users) {
      const message = `Happy birthday ${user.name} <${user.email}>`

      this.mqClient.emit("birthday_message_sent", { message })
    }
  }
}
