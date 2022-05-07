import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { MemberType, RowStatus } from '../constants/gather.common';

@Entity()
export class UserProfile {
  // TODO: This class reflects the "old" API, but it's a direct copy of the old database structure for legacy...
  // Take a look at user.profile.mock to see reflection of "new" properties...

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  memberTypeId: number;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  password: string;

  // UserProfile class cannot extend "GatherEntity" (see below items), because GatherEntity references this class. 
  // Typeorm is not happy with the circular reference. Remember to keep these columns up to date when GatherEntity is updated.
  // @Column()
  // createdOn: Date;

  // @OneToOne(type => UserProfile)
  // @JoinColumn()
  // createdBy: UserProfile;

  // @Column({nullable: true})
  // modifiedOn: Date;

  // @OneToOne(type => UserProfile, {nullable: true})
  // @JoinColumn()
  // modifiedBy: UserProfile;
  // // modifiedBy: number;

  // @Column({default: 1})
  // rowStatus: RowStatus;

  // @Column({default: 1})
  // rowVersion: number;
}