import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    const exitingTag = await this.tagRepository.find({
      where: { name: createTagDto.name },
    });

    let newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }

  public async findMultipleTags(tags: string[]) {
    return await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });
  }

  public async deleteTag(id: string) {
    await this.tagRepository.delete(id);
    return { deleted: true, id };
  }

  public async softDeleteTag(id: string) {
    await this.tagRepository.softDelete(id);
    return { deleted: true, id };
  }
}
