import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { MemberType } from 'src/constants/gather.common';
import { Subscription } from './subscription.mock';

@Entity()
export class Team extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;
  address: string;
  billingAddress: string;
  contactName: string;
  email: string;
  phone: string;
  mobile: string;

  warehouse: string;
  subscription: Subscription;
  connectionString: string;
  teamCode: string;
}