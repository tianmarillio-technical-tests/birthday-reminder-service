import { Injectable } from "@nestjs/common"
import { timeZonesNames } from "@vvo/tzdb"
import { DateTime } from "luxon"

@Injectable()
export class DateTimeUtils {
  // DATETIME
  getNowUtc() {
    return DateTime.now().toUTC()
  }

  getCurrentMinuteIso(offsetMinutes = 0): string {
    return DateTime.now()
      .plus({ minutes: offsetMinutes })
      .startOf("minute")
      .toISO()
  }

  // BIRTHDAY
  parseBirthdayToIso(
    birthday: string,
    timezone: string,
    offsetHours: number = 9,
  ): string {
    const localBirthdayDateTime = DateTime.fromISO(birthday, {
      zone: timezone,
    })
      .startOf("day")
      .set({
        hour: offsetHours,
      })

    const birthdayUtcIso = localBirthdayDateTime.toUTC().toISO()

    // Will return ISO date string at UTC timezone which corresponds
    // with local date time at 00:00 plus offset hours
    return birthdayUtcIso
  }

  // TIMEZONE
  getTimeZones(): string[] {
    return timeZonesNames
  }

  validateTimeZone(timeZone: string): boolean {
    return this.getTimeZones().includes(timeZone)
  }
}
