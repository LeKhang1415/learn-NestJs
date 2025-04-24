import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { GenerateTokenProvider } from './generate-token.provider';
import { UsersService } from '../../users/providers/users.service';
import { ActiveUserInterface } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,

    // Inject cấu hình JWT từ file jwt.config.ts
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // Provider để sinh accessToken và refreshToken mới
    private readonly generateTokenProvider: GenerateTokenProvider,

    // Inject UsersService với forwardRef để tránh vòng lặp phụ thuộc
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Giải mã refresh token và trích xuất `sub` (ID người dùng)
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserInterface, 'sub'>
      >(refreshTokenDto.refresh_token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      // Tìm người dùng tương ứng theo `sub` (ID)
      const user = await this.usersService.findOneById(sub);

      // Sinh token mới (access + refresh) cho người dùng
      return await this.generateTokenProvider.generateToken(user);
    } catch (error) {
      // Nếu token không hợp lệ hoặc quá hạn => ném lỗi 401 Unauthorized
      throw new UnauthorizedException(error);
    }
  }
}
