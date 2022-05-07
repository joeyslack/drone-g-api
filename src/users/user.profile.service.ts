import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Side, StructureTypes } from 'src/constants/gather.common';
import { UserProfile } from './user.profile.entity';

class UserProfileResponse {
  constructor(data) {
    return {
      timeStamp: new Date(),
      responseCode: "Success",
      validationErrorsList: [],
      response: {
        ...data,
        profileId: data.id,
        type: data.memberTypeId === 1 ? 'Manager' : 'User',
        isActive: data ? true : false
      }
    };
  }
}

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async getUsers() { 
    const profiles = await this.userProfileRepository.find();
    return new UserProfileResponse({users: profiles});
  }
}