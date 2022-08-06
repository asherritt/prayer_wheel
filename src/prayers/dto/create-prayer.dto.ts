import {
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePrayerDto {
  @IsInt()
  @IsNotEmpty()
  userId;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(2)
  displayName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(10)
  prayerText: string;

  @IsString()
  location: string;
}
