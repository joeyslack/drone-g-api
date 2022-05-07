import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Structure } from './structure.entity';

@Entity()
export class Warehouse extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // Tag of Warehouse to be use during
  code: string;

  @Column()
  // Name of Warehouse
  name: string;

  @Column()
  // Address of Warehouse
  address: string;

  @Column({default: 0})
  // Geolocation of Warehouse
  geoLocation: string;

  @Column({default: 3})
  // Levelsin warehouse structure hierarchy
  levels: number;

  @OneToMany(type => Structure, s => s.warehouse) 
  structures: Structure[];

  @Column()
  // Directory to store warehouse data
  directory: string;
}