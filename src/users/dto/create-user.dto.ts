import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  country: string;
  firstName: string;
  lastName: string;
  loacation: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(6)
  userName: string;
}
