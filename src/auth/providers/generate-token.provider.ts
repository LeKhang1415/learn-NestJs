import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserInterface } from '../interfaces/active-user.interface';
import { User } from '../../users/user.entity';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    private readonly jwtService: JwtService,

    // Inject JWTConfig
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      } as ActiveUserInterface,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateToken(user: User) {
    // Tạo đồng thời accessToken và refreshToken bằng Promise.all để tối ưu tốc độ
    const [accessToken, refreshToken] = await Promise.all([
      // Tạo accessToken với payload có chứa email (dạng Partial để không cần đủ ActiveUserInterface)
      this.signToken<Partial<ActiveUserInterface>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ),

      // Tạo refreshToken không cần payload
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl),
    ]);

    // Trả về object chứa cả accessToken và refreshToken
    return {
      accessToken,
      refreshToken,
    };
  }
}
