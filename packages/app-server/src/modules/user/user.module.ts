import { Module } from "@nestjs/common"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "./schemas/user.schema"
import { UtilsModule } from "src/utils/utils.module"
import { UserBirthdayController } from "./user-birthday.controller"
import { UserBirthdayService } from "./user-birthday.service"
import { RabbitmqModule } from "src/rabbitmq/rabbitmq.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UtilsModule,
    RabbitmqModule,
  ],
  controllers: [UserController, UserBirthdayController],
  providers: [UserService, UserBirthdayService],
})
export class UserModule {}
