import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { UsersService } from "../users/users.service"
import type { PrismaService } from "@task-management/prisma"
import * as bcrypt from "bcrypt"
import type { User } from "@prisma/client"
import type { RefreshTokenService } from "./refresh-token.service"
import type { TwoFactorAuthService } from "./two-factor-auth.service"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private refreshTokenService: RefreshTokenService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    // Si l'authentification à deux facteurs est activée, générer un code
    if (user.twoFactorEnabled) {
      const { code, expiryDate } = this.twoFactorAuthService.generateTwoFactorCode()

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: code,
          twoFactorExpiry: expiryDate,
        },
      })

      return {
        requireTwoFactor: true,
        userId: user.id,
      }
    }

    // Sinon, générer directement les tokens
    return this.generateTokens(user)
  }

  async verifyTwoFactorCode(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.twoFactorCode || user.twoFactorExpiry < new Date()) {
      throw new UnauthorizedException("Code invalide ou expiré")
    }

    if (user.twoFactorCode !== code) {
      throw new UnauthorizedException("Code incorrect")
    }

    // Réinitialiser le code 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorCode: null,
        twoFactorExpiry: null,
      },
    })

    return this.generateTokens(user)
  }

  private async generateTokens(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.roleId }

    // Générer le token d'accès
    const accessToken = this.jwtService.sign(payload)

    // Générer le token de rafraîchissement
    const refreshToken = await this.refreshTokenService.createRefreshToken(user.id)

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const token = await this.refreshTokenService.validateRefreshToken(refreshToken)
    const user = await this.usersService.findById(token.userId)

    const payload = { username: user.username, sub: user.id, role: user.roleId }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
