import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { User } from './user.entity';
import { UserProfile } from 'src/helpers/user.profile.mock';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly usersRepository: Repository<UserProfile>,
  ) {}

  Authenticate(email: string, password: string) {
    return this.usersRepository.findOneOrFail({
      where: {
        email,
        password
      }
    });
  }

  isEmailExists() {
    return false;
  }

  getByTeamName(teamName: string) {
    return this.usersRepository.findOne({
      where: {
        email: teamName.toLowerCase()
      }
    })
  }

  getByProfileId(profileId: number) {
    return this.usersRepository.findOne(profileId);
  }

  getInvitation(userProfileId, code) {
    return this.usersRepository.findOne({
      where: {
        id: userProfileId,
        code
      }
    });
  }

  getInvitationById(userProfileId: number) {
    return this.usersRepository.findOne(userProfileId);
  }

  add(userProfile: UserProfile) {
    return this.usersRepository.insert(userProfile);
  }

  update(userProfile: UserProfile) {
    return this.usersRepository.save(userProfile);
  }


}