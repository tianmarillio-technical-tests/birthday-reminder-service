import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
// import { Model } from "mongoose"
import { BadRequestException } from "@nestjs/common"
import { UserService } from "./user.service"
import { User } from "./schemas/user.schema"
import { DateTimeUtils } from "src/utils/date-time/date-time.utils"
import { CreateUserDto } from "./dtos/create-user.dto"

describe("UserService - create method", () => {
  let service: UserService
  // let userModel: Model<User>
  // let dateTimeUtils: DateTimeUtils

  const mockUser = {
    _id: "user123",
    email: "test@example.com",
    birthday: "2000-01-01T00:00:00.000Z",
    timezone: "UTC",
  }

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  }

  const mockDateTimeUtils = {
    validateTimeZone: jest.fn(),
    parseBirthdayToIso: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: DateTimeUtils,
          useValue: mockDateTimeUtils,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    // userModel = module.get<Model<User>>(getModelToken(User.name))
    // dateTimeUtils = module.get<DateTimeUtils>(DateTimeUtils)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("create", () => {
    const createDto: CreateUserDto = {
      name: "example",
      email: "new@example.com",
      birthday: "2000-01-01",
      timezone: "UTC",
    }

    it("should create a new user successfully", async () => {
      mockUserModel.findOne.mockResolvedValue(null)
      mockDateTimeUtils.validateTimeZone.mockReturnValue(true)
      mockDateTimeUtils.parseBirthdayToIso.mockReturnValue(
        "2000-01-01T00:00:00.000Z",
      )
      mockUserModel.create.mockResolvedValue(mockUser)

      await service.create(createDto)

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createDto.email,
      })
      expect(mockDateTimeUtils.validateTimeZone).toHaveBeenCalledWith(
        createDto.timezone,
      )
      expect(mockDateTimeUtils.parseBirthdayToIso).toHaveBeenCalledWith(
        createDto.birthday,
        createDto.timezone,
        9,
      )
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...createDto,
        birthday: "2000-01-01T00:00:00.000Z",
      })
    })

    it("should throw BadRequestException if email already exists", async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser)

      await expect(service.create(createDto)).rejects.toThrow(
        new BadRequestException("Email already used"),
      )

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createDto.email,
      })
      expect(mockDateTimeUtils.validateTimeZone).not.toHaveBeenCalled()
      expect(mockDateTimeUtils.parseBirthdayToIso).not.toHaveBeenCalled()
      expect(mockUserModel.create).not.toHaveBeenCalled()
    })

    it("should throw BadRequestException if timezone is invalid", async () => {
      mockUserModel.findOne.mockResolvedValue(null)
      mockDateTimeUtils.validateTimeZone.mockReturnValue(false)

      await expect(service.create(createDto)).rejects.toThrow(
        new BadRequestException(
          "Invalid timezone string, kindly checkout GET /time-zones",
        ),
      )

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createDto.email,
      })
      expect(mockDateTimeUtils.validateTimeZone).toHaveBeenCalledWith(
        createDto.timezone,
      )
      expect(mockDateTimeUtils.parseBirthdayToIso).not.toHaveBeenCalled()
      expect(mockUserModel.create).not.toHaveBeenCalled()
    })

    it("should process birthday with timezone correctly", async () => {
      const customDto = {
        ...createDto,
        birthday: "1995-12-25",
        timezone: "Asia/Tokyo",
      }
      const processedDate = "1995-12-25T00:00:00.000Z"

      mockUserModel.findOne.mockResolvedValue(null)
      mockDateTimeUtils.validateTimeZone.mockReturnValue(true)
      mockDateTimeUtils.parseBirthdayToIso.mockReturnValue(processedDate)
      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        birthday: processedDate,
      })

      await service.create(customDto)

      expect(mockDateTimeUtils.parseBirthdayToIso).toHaveBeenCalledWith(
        customDto.birthday,
        customDto.timezone,
        9,
      )
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...customDto,
        birthday: processedDate,
      })
    })
  })
})
