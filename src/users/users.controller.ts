import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(
    // Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

  @Get('{/:id}')
  public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return 'You sent a post request to users endpoint';
  }
}
