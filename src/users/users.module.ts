
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UsersService } from 'src/mission/user.service';
import { UserProfilesService } from './user.profile.service';
// import { WarehouseService } from './warehouse.service';
import { UserProfile } from './user.profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [UserProfilesService],
})

export class UsersModule {}