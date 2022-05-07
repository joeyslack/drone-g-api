import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side } from 'src/constants/gather.common';
import { Product } from './product.entity';
import { InventoryItem } from './inventory.item.entity';

@Entity()
export class InventoryGallery extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(type => InventoryItem, {nullable: true})
  // @JoinColumn()
  // This should be linked as a relationship, but all of the rows are "0", must fix data first.
  @Column({ default: 0 })
  // Inventory item image belongs to
  inventoryItemId: number;

  @Column()
  imagePath: string;
  
  @Column()
  thumbnailPath: string;

  @Column({type:'timestamptz'})
  captureTime: Date;

  @Column()
  fileName: string;
}