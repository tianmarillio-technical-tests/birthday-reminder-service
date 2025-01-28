import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"
import { CreateUserDto } from "./dtos/create-user.dto"
import { UpdateUserDto } from "./dtos/update-user.dto"
import { DateTimeUtils } from "src/utils/date-time/date-time.utils"

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly dateTimeUtils: DateTimeUtils,
  ) {}

  // QUERIES
  async getMany(): Promise<UserDocument[]> {
    return await this.userModel.find().exec()
  }

  async getById(userId: string): Promise<UserDocument | null> {
    return await this.userModel.findById(userId).exec()
  }

  async getByIdOrThrow(userId: string): Promise<UserDocument> {
    const user = await this.getById(userId)

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async getByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({
      email,
    })
  }

  // COMMANDS
  async create(dto: CreateUserDto): Promise<void> {
    const { ...createPayload } = dto

    // Handle conflicting email
    const conflictingEmail = await this.getByEmail(createPayload.email)

    if (conflictingEmail) {
      throw new BadRequestException("Email already used")
    }

    // Validate timezone string
    const isValidTimeZone = this.dateTimeUtils.validateTimeZone(
      createPayload.timezone,
    )

    if (!isValidTimeZone) {
      throw new BadRequestException(
        "Invalid timezone string, kindly checkout GET /time-zones",
      )
    }

    // Pre-process birthday date before storing into database
    createPayload.birthday = this.dateTimeUtils.parseBirthdayToIso(
      createPayload.birthday,
      createPayload.timezone,
      9,
    )

    await this.userModel.create(createPayload)
  }

  async update(userId: string, dto: UpdateUserDto): Promise<void> {
    const { ...updatePayload } = dto
    const user = await this.getByIdOrThrow(userId)

    // Handle conflicting email when email changed
    if (updatePayload.email && updatePayload.email !== user.email) {
      const conflictingEmail = await this.getByEmail(updatePayload.email)

      if (conflictingEmail) {
        throw new BadRequestException("Email already used")
      }
    }

    // Validate timezone string
    if (updatePayload.timezone) {
      const isValidTimeZone = this.dateTimeUtils.validateTimeZone(
        updatePayload.timezone,
      )

      if (!isValidTimeZone) {
        throw new BadRequestException(
          "Invalid timezone string, kindly checkout GET /time-zones",
        )
      }
    }

    // re-preprocess birthday date before storing into database
    // if birthday or timezone changed
    if (updatePayload.birthday || updatePayload.timezone) {
      const timezoneParam = updatePayload.timezone ?? user.timezone

      updatePayload.birthday = this.dateTimeUtils.parseBirthdayToIso(
        updatePayload.birthday,
        timezoneParam,
        9,
      )
    }

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      updatePayload,
    )
  }

  async delete(userId: string): Promise<void> {
    const user = await this.getByIdOrThrow(userId)

    await this.userModel.deleteOne({
      _id: user._id,
    })
  }
}
