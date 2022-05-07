import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from './warehouse.entity';
import { StructureTypes, Side } from 'src/constants/gather.common';
import { Structure } from './structure.entity';

@Entity()
export class Bin extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Structure, s => s.children)
  // Structure where Bin is located
  structure: Structure;

  @Column({ nullable: true })
  structureId: number;

  @Column()
  // Name of bin
  name: string;

  @Column()
  // Visual Tag of Bin to be used during scanning
  code: string;

  @Column()
  // Position/Index of Bin inside Rack
  position: number;

  @Column()
  // {Unknown, Left, Right}
  side: Side;

  @Column()
  clientLocation: string;
}