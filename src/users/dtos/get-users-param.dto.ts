import { IsInt, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    example: '12345',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
