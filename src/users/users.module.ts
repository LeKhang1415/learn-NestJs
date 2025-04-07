import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many-provider';
import profileConfig from './config/profile.config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
  exports: [UsersService],
})
export class UsersModule {}
