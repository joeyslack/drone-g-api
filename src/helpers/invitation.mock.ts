import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { MemberType } from 'src/constants/gather.common';
import { Package } from './package.mock';

@Entity()
export class Invitation extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  profile: string;
  code: string;
  expiresOn: Date;
  utilizedOn: Date;
}