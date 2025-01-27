import { Module } from "@nestjs/common"
import { UserBirthdayService } from "./user-birthday.service"
import { RabbitmqModule } from "src/rabbitmq/rabbitmq.module"
import { UserBirthdayController } from "./user-birthday.controller"

@Module({
  imports: [RabbitmqModule],
  controllers: [UserBirthdayController],
  providers: [UserBirthdayService],
  exports: [UserBirthdayService],
})
export class UserModule {}
