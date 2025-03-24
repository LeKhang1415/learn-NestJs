import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionDto } from '../dtos/create-post-meta-option.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(
    CreatePostMetaOptionDto: CreatePostMetaOptionDto,
  ) {
    let metaOption = this.metaOptionRepository.create(CreatePostMetaOptionDto);

    return await this.metaOptionRepository.save(metaOption);
  }
}
