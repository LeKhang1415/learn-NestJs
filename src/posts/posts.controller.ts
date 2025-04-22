import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { GetPostDto } from './dtos/get-post.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserInterface } from '../auth/interfaces/active-user.interface';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:userId}')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostDto,
  ) {
    return this.postsService.findAll(postQuery, userId);
  }

  @ApiOperation({
    summary: 'Creates A Posts',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
  })
  @Post('')
  public async createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.postsService.createPost(createPostDto, user);
  }

  @ApiOperation({
    summary: 'Updates and existing blog post in the database.',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a success 20o response if the post is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostsDto: PatchPostDto) {
    return this.postsService.updatePost(patchPostsDto);
  }

  @Delete('{/:postId}')
  public async deletePost(@Param('postId') postId: string) {
    return this.postsService.deletePost(postId);
  }
}
