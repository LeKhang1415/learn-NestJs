import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /*
     * Injecting Tags Service
     */
    private readonly tagsService: TagsService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createPost(createPostDto: CreatePostDto) {
    let author = await this.usersService.findOneById(createPostDto.authorId);

    if (!author) throw new Error('User not found');

    let tags = await this.tagsService.findMultipleTags(
      createPostDto.tags ?? [],
    );

    // Tạo bài viết
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    // find all posts
    return await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });
  }
  public async deletePost(postId: string) {
    await this.postsRepository.delete({ id: postId });

    return { deleted: true, postId };
  }
}
