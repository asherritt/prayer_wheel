import { SerializeOptions } from '@nestjs/common';
import {
  ClassSerializerInterceptor,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
