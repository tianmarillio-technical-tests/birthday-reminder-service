import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator"

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  birthday?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  timezone?: string
}
