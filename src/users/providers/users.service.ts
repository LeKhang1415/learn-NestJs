import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Injecting ConfigService
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null;

    try {
      // Kiểm tra xem người dùng với email đã tồn tại chưa
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        {
          description: 'Lỗi kết nối đến cơ sở dữ liệu',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'Người dùng đã tồn tại, vui lòng kiểm tra lại email',
      );
    }

    // Tiến hành tạo người dùng mới
    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        {
          description: 'Lỗi kết nối đến cơ sở dữ liệu',
        },
      );
    }
    // Trả về thông tin người dùng đã được tạo thành công
    return newUser;
  }

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  public async findOneById(id: string) {
    let existingUser: User | null;

    try {
      // Kiểm tra xem người dùng với id đã tồn tại chưa
      existingUser = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException(
        'Không thể xử lý yêu cầu của bạn ngay lúc này, vui lòng thử lại sau',
        {
          description: 'Lỗi kết nối đến cơ sở dữ liệu',
        },
      );
    }

    // Nếu người dùng không tồn tại, báo lỗi
    if (!existingUser) {
      throw new BadRequestException(
        'Người dùng không tồn tại, vui lòng kiểm tra lại id',
      );
    }

    // Nếu có, trả về thông tin người dùng
    return existingUser;
  }
}
