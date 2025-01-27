import { Test, TestingModule } from "@nestjs/testing"
import { DateTimeUtils } from "./date-time.utils"

describe("DateTimeService", () => {
  let service: DateTimeUtils

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateTimeUtils],
    }).compile()

    service = module.get<DateTimeUtils>(DateTimeUtils)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
