import { Module } from "@nestjs/common"
import { TaskSchedulerService } from "./task-scheduler.service"
import { UserModule } from "src/modules/user/user.module"

@Module({
  imports: [UserModule],
  providers: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
