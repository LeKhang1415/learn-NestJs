import {
  isArray,
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionDto } from './create-post-meta-option.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { fromAsyncIterable } from 'rxjs/internal/observable/innerFrom';

export class CreatePostDto {
  @ApiProperty({
    example: 'nestjs learn',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  title: string;

  @ApiProperty({
    enum: PostType,
    example: 'post',
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    example: 'nestjs-learn',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug không hợp lệ! Chỉ dùng chữ thường, số và dấu gạch ngang.',
  })
  slug: string;

  @ApiProperty({
    enum: PostStatus,
    example: 'draft',
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    example: 'post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example:
      '{\r\n "@context": "https:\\/\\/schema.org",\r\n "@type": "Person"\r\n }',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    example: 'http:://khang.com/images/img.jpg',
  })
  @IsUrl()
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publicOn?: Date;

  @ApiPropertyOptional({
    example: ['abc', 'xyz'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          example: true,
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionDto)
  metaOptions?: CreatePostMetaOptionDto[];
}
