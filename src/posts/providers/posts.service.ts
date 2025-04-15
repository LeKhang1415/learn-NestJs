import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from '../../tags/tag.entity';
import { GetPostDto } from '../dtos/get-post.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';

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

    private readonly paginationProvider: PaginationProvider,

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

  public async findAll(
    postQuery: GetPostDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    const page = postQuery.page ?? 1;
    const limit = postQuery.limit ?? 10;
    // find all posts
    return await this.paginationProvider.paginateQuery(
      {
        limit,
        page,
      },
      this.postsRepository,
    );
  }

  public async updatePost(patchPostDto: PatchPostDto) {
    let tags: Tag[] | null;
    let post: Post | null;

    // 🔎 Tìm các tag theo ID
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags ?? []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        {
          description: 'Lỗi kết nối đến cơ sở dữ liệu',
        },
      );
    }

    /**
     * ❌ Nếu không tìm thấy đủ tag
     * → Số lượng tag tìm được phải bằng với số lượng ID truyền vào
     */
    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Vui lòng kiểm tra lại các tag ID, có thể một số ID không tồn tại',
      );
    }

    // 🔍 Tìm bài viết cần cập nhật
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        {
          description: 'Lỗi kết nối đến cơ sở dữ liệu',
        },
      );
    }

    // ❌ Nếu không tìm thấy bài viết
    if (!post) {
      throw new BadRequestException('ID bài viết không tồn tại');
    }

    // ✏️ Cập nhật các trường của bài viết nếu có dữ liệu mới
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // 🔗 Gán lại danh sách tag mới
    post.tags = tags;

    // 💾 Lưu bài viết và trả về kết quả
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        {
          description: 'Lỗi kết nối đến cơ sở dữ liệu',
        },
      );
    }

    return post;
  }

  public async deletePost(postId: string) {
    await this.postsRepository.delete({ id: postId });

    return { deleted: true, postId };
  }
}
