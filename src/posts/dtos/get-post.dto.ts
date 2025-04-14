import { IsDate, IsOptional } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDTO } from '../../common/pagination/dtos/pagination-query.dto';

class GetPostBaseDto {
  @IsDate()
  @IsOptional()
  startDay?: Date;

  @IsDate()
  @IsOptional()
  endDay: Date;
}

export class GetPostDto extends IntersectionType(
  GetPostBaseDto,
  PaginationQueryDTO,
) {}
