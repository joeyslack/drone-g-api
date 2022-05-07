import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

@Entity()
export class Drone extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  // Warehouse Drone belongs to
  warehouseId: number;

  @Column()
  // Name of Drone
  name: string;

  @Column({nullable: true})
  // Brief
  description: string;
}