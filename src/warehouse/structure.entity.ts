import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, TreeChildren, Tree, TreeParent } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from './warehouse.entity';
import { StructureTypes, Side } from 'src/constants/gather.common';

@Entity()
@Tree("materialized-path")
export class Structure extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Warehouse, w => w.structures)
  // Warehouse where structure is located
  warehouse: Promise<Warehouse>;

  @Column({default: 2})
  // Type of Structure {Aisle, Rack, Floor etc}
  structureType: StructureTypes;

  @Column()
  // Visual Tag of Structure to be use during scanning
  code: string;

  @Column()
  // Name of Structure
  title: string;

  @Column({default: 2})
  // Hierarchy Level
  level: number;

  @Column()
  // {Unknown , Left , Right }
  side: Side;

  @Column({default: 0})
  // Position/Index of structure inside parent
  position: number;

  @TreeChildren()
  // Structure List of Immediate Child Structure
  children: Structure[];

  @TreeParent()
  // Structure Parent Structure in hierarchy
  parentStructure: Structure;
}