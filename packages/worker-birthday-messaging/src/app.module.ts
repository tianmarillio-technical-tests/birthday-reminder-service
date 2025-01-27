import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TaskSchedulerModule } from "./task-scheduler/task-scheduler.module"
import { ScheduleModule } from "@nestjs/schedule"
import { UserModule } from "./modules/user/user.module"
import { RabbitmqModule } from "./rabbitmq/rabbitmq.module"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RabbitmqModule,
    TaskSchedulerModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
