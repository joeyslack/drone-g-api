import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { MemberType } from 'src/constants/gather.common';
import { Package } from './package.mock';

@Entity()
export class Subscription extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  package: Package;
  lastPaymentDate: Date;
  nextPaymentDate: Date;
  warehouseCount: number;
  monthCount: number;
  price: PaymentCurrencyAmount;
  discount: PaymentCurrencyAmount;
}