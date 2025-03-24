import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionDto } from './dtos/create-post-meta-option.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    // Injecting Users Service
    private readonly MetaOptionsService: MetaOptionsService,
  ) {}

  @Post()
  public async createPost(
    @Body() createPostMetaOptionDto: CreatePostMetaOptionDto,
  ) {
    return this.MetaOptionsService.createMetaOption(createPostMetaOptionDto);
  }
}
