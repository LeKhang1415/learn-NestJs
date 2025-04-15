import { DataSource } from 'typeorm';
import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject the datasource
     */
    private dataSource: DataSource,
  ) {}

  public async createManyUsers(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];

    // Tạo một queryRunner để thực hiện transaction thủ công
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect(); // Kết nối database
      await queryRunner.startTransaction(); // Bắt đầu transaction
    } catch (error) {
      throw new RequestTimeoutException('Không thể kết nối database ');
    }

    try {
      for (let user of createManyUsersDto.users) {
        // Tạo một entity mới từ DTO
        let newUser = queryRunner.manager.create(User, user);

        // Lưu entity vào DB qua queryRunner
        let result = await queryRunner.manager.save(newUser);

        // Thêm user đã lưu vào danh sách kết quả
        newUsers.push(result);
      }

      // Nếu tất cả đều thành công, commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Nếu có lỗi, rollback transaction để đảm bảo không có user nào được lưu
      throw new ConflictException('Không thể hoàn thành transaction', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    // Trả về danh sách người dùng đã được tạo
    return newUsers;
  }
}
