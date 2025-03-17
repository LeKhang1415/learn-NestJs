import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMetaOptionDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  value: any;
}
