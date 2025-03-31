import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  public async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Delete('/:tagId')
  public async deleteTag(@Param('tagId') tagId: string) {
    return this.tagService.deleteTag(tagId);
  }

  @Delete('soft-delete/:tagId')
  public async softDeleteTag(@Param('tagId') tagId: string) {
    return this.tagService.softDeleteTag(tagId);
  }
}
