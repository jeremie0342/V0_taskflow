import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { Public } from "./decorators/public.decorator"
import type { RegisterDto } from "./dto/register.dto"
import type { UsersService } from "../users/users.service"
import type { TwoFactorAuthDto } from "./dto/two-factor-auth.dto"
import type { RefreshTokenDto } from "./dto/refresh-token.dto"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  @Public()
  @Post('two-factor')
  @HttpCode(HttpStatus.OK)
  async verifyTwoFactorCode(@Body() twoFactorAuthDto: TwoFactorAuthDto) {
    return this.authService.verifyTwoFactorCode(
      twoFactorAuthDto.userId,
      twoFactorAuthDto.code,
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}
