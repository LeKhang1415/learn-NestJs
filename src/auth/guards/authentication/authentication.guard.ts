import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from '../../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  // Giá trị xác thực mặc định nếu không được chỉ định ở handler/controller
  private static readonly defaultAuthType = AuthType.Bearer;

  // Bản đồ ánh xạ loại xác thực => Guard tương ứng
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    // Để đọc metadata từ controller/handler
    private readonly reflector: Reflector,

    // Guard xác thực bằng Bearer token
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true }, // Không yêu cầu xác thực
    };
  }

  // Hàm được gọi mỗi khi một request cần xác thực
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lấy các loại Auth được chỉ định trên route (metadata từ @SetMetadata hoặc @Auth())
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType]; // Nếu không có thì dùng mặc định

    // Lấy tất cả guard tương ứng với các loại xác thực đã được chỉ định
    const guardOrGuards = authTypes
      .map((type) => this.authTypeGuardMap[type])
      .flat(); // Nếu có nhiều guard cho 1 loại thì "dẹp" chúng ra cùng 1 mảng

    const error = new UnauthorizedException();

    for (const instance of guardOrGuards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context), // Gọi guard đó với context hiện tại
      ).catch((err) => console.error(err)); // Log lỗi nếu có

      if (canActivate) {
        return true; // Nếu có ít nhất 1 guard cho phép => cho qua
      }
    }

    throw error; // Nếu tất cả guard đều từ chối => quăng lỗi 401
  }
}
