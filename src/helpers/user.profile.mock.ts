import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { MemberType } from 'src/constants/gather.common';
import { Team } from './team.mock';

@Entity()
export class UserProfile extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  team: Team;

  firstName: string;

  lastName: string;

  // {Admin, Manager, Member}
  memberType: MemberType;

  email: string;

  mobile: string;

  password: string;

  isVerified: boolean;

  inActive: boolean;
}