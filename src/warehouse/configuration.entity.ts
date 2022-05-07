import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { GatherEntity } from '../helpers/gather.entity';
import { Warehouse } from './warehouse.entity';
import { StructureTypes, Side } from '../constants/gather.common';
import { Structure } from './structure.entity';

@Entity()
export class Configuration extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Warehouse)
  // Warehouse configuration belongs to
  @JoinColumn()
  warehouse: Warehouse

  @Column()
  // Name of KEY
  key: string;

  @Column()
  // Attached Value
  value: string;
}