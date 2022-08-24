import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(2)
  country: string;

  @IsString()
  @MaxLength(80)
  firstName: string;

  @IsString()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(12)
  phone: string;

  @IsBoolean()
  emailEnabled: boolean;

  @IsBoolean()
  phoneEnabled: boolean;

  @IsString()
  @MaxLength(80)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(2)
  loacation: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @MinLength(6)
  password: string;
}
