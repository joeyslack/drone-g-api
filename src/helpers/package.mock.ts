import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { MemberType } from 'src/constants/gather.common';

@Entity()
export class Package extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  title: string;
  description: string;
  monthCount: number;
  warehouseCount: number;
  price: PaymentCurrencyAmount;
  discount: PaymentCurrencyAmount;
}