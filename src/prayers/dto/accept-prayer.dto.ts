import {
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class AcceptPrayerDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
