import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../../meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createPost(createPostDto: CreatePostDto) {
    // Tạo bài viết
    let post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    // find all posts
    return await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });
  }
  public async deletePost(postId: string) {
    await this.postsRepository.delete({ id: postId });

    return { deleted: true, postId };
  }
}
