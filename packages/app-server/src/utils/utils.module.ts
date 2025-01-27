import { Module } from "@nestjs/common"
import { DateTimeUtils } from "./date-time/date-time.utils"

@Module({
  providers: [DateTimeUtils],
  exports: [DateTimeUtils],
})
export class UtilsModule {}
