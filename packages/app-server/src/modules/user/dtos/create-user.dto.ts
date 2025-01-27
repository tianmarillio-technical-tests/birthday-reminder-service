import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator"

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  birthday: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timezone: string
}
