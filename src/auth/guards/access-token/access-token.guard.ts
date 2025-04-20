import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import JwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    try {
      request[REQUEST_USER_KEY] = this.jwtService.verify<JwtPayload>(
        token,
        this.jwtConfiguration,
      );
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];

    return token;
  }
}
