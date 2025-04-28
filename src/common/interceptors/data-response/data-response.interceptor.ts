import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataResponseInterceptor<T> implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ apiVersion: string; data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        apiVersion:
          this.configService.get<string>('appConfig.apiVersion') || '1.0',
        data: data,
      })),
    );
  }
}
