import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { RefreshTokenProvider } from './refresh-token.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // Inject HashingProvider
    private readonly hashingProvider: HashingProvider,

    private readonly generateTokenProvider: GenerateTokenProvider,

    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const existingUser = await this.usersService.findOneByEmail(
      signInDto.email,
    );

    let isEqual: boolean = false;

    try {
      // So sánh mật khẩu người dùng nhập vào và mật khẩu đã lưu trong cơ sở dữ liệu
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        existingUser.password,
      );
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        { description: 'Lỗi khi so sánh mật khẩu' },
      );
    }

    // Nếu mật khẩu không khớp, ném ra lỗi
    if (!isEqual) {
      throw new BadRequestException(
        'Mật khẩu không chính xác, vui lòng thử lại.',
      );
    }

    return this.generateTokenProvider.generateToken(existingUser);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
