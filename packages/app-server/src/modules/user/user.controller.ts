import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dtos/create-user.dto"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  @Get()
  async getUsers() {
    return await this.userService.getMany()
  }

  @Get("id")
  async getUserById(@Param("id") userId: string) {
    return await this.userService.getByIdOrThrow(userId)
  }

  @Patch("id")
  async updateUser(@Param("id") userId: string, @Body() dto: UpdateUserDto) {
    return await this.userService.update(userId, dto)
  }

  @Delete("id")
  async deleteUser(@Param("id") userId: string) {
    return await this.userService.delete(userId)
  }
}
