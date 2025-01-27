import { Injectable } from "@nestjs/common"
import { DateTimeUtils } from "./utils/date-time/date-time.utils"

@Injectable()
export class AppService {
  constructor(private readonly dateTimeUtils: DateTimeUtils) {}

  healthCheck(): { status: string } {
    return { status: "ok" }
  }

  getTimeZones() {
    return this.dateTimeUtils.getTimeZones()
  }
}
