import { Controller, Post, Body, NotFoundException, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/users.dto';
import { AuthDto } from './auth.dto';
import { UserWithRole } from '../users/users.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<UserWithRole | void> {
    return await this.usersService.create(body);
  };

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto) {
    const user = await this.usersService.getByEmail(body.email)
    if (!user) throw new NotFoundException(`user with email ${body.email} not found.`)
    const isValid = await this.usersService.validPassword(body.password, user)
    if (isValid) return await this.authService.login(user)
  };

  @Post('refreshToken')
  @HttpCode(200)
  async refresh(@Headers('x-refresh-token') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token is missing');
    return this.authService.refreshToken(refreshToken);
  }
}
