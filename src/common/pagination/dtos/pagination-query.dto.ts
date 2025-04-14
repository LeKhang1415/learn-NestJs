import { Optional } from '@nestjs/common';
import { IsPositive } from 'class-validator';

export class PaginationQueryDTO {
  @Optional()
  @IsPositive()
  limit?: number = 10;

  @Optional()
  @IsPositive()
  page?: number = 1;
}
