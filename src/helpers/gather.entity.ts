import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
// import { UserProfile } from 'src/mission/user.profile.entity';
import { RowStatus } from 'src/constants/gather.common';
import { UserProfile } from '../users/user.profile.entity';

export class GatherEntity {
  @CreateDateColumn()
  createdOn: Date;

  @ManyToOne(type => UserProfile)
  @JoinColumn()
  createdBy: UserProfile;

  @UpdateDateColumn({nullable: true})
  modifiedOn: Date;

  @ManyToOne(type => UserProfile, {nullable: true})
  @JoinColumn()
  modifiedBy: UserProfile;
  // modifiedBy: number;

  @Column({default: 1})
  rowStatus: RowStatus;

  @VersionColumn({default: 1})
  rowVersion: number;
}