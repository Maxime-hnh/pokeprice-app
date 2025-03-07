import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserWithRole } from './users.types';
import { CreateUserDto, PartialUserDto } from './dto/users.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserWithRole | void> {
    return await this.usersService.create(body);
  };

  @Get('/email/:email')
  async getByEmail(@Param('email') email: string): Promise<UserWithRole | void> {
    const user = await this.usersService.getByEmail(decodeURI(email));
    if (!user) throw new NotFoundException(`user with email ${decodeURI(email)} not found.`)
    return user;
  };

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Get('all')
  async getAll(): Promise<User[] | void> {
    return this.usersService.findAll();
  };

  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserWithRole | void> {
    const user = await this.usersService.getById(+id);
    if (!user) throw new NotFoundException(`user with id ${id} not found.`)
    return user;
  };


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: PartialUserDto,
    @CurrentUser() user: User
  ): Promise<User | void> {
    if (user.id !== +id) throw new ForbiddenException()
    return await this.usersService.update(+id, body);
  };
}
