import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side } from 'src/constants/gather.common';
import { Product } from './product.entity';
import { MissionBin } from 'src/mission/mission.bin.entity';
import { InventoryGallery } from './inventory.gallery.entity';

@Entity()
export class InventoryItem extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @ManyToOne(type => Product)
  @JoinColumn()
  // Product inventory item belongs to
  product: Product;

  @ManyToOne(type => MissionBin)
  @JoinColumn()
  // Bin where item found
  missionBin: MissionBin;

  @Column({default: 'box'})
  // Visual tag identified
  code: string;

  @Column({default: ''})
  // To store error/product description
  notes: string;

  @Column({default: 0})
  // Quantity of product found in each bin
  quantity: number;

  @Column({default: 1})
  // Number of days left in inventory
  daysLeft: number;

  @Column({default: 1})
  // Bar code text
  barCodeText: string;

  // @OneToMany(type => InventoryGallery, ig => ig.inventoryItem)
  // @JoinColumn()
  // // List of images path relative to mission folder
  // images: InventoryGallery[];

  // @OneToMany(type => InventoryGallery, ig => ig.inventoryItem, {nullable: true})
  // @JoinColumn()
  // // List of images path relative to mission folder
  // thumbnails: InventoryGallery[];

  @Column({ default: 'Good', nullable: true })
  condition: string;

  @ManyToOne(type => InventoryGallery)
  @JoinColumn()
  inventoryGallery: InventoryGallery;

  @Column({ nullable: true })
  verificationDate: Date;

  @Column({ nullable: true })
  verificationSource: string;

  @Column({ default: false })
  verifiedRecord: boolean;

  @Column({ nullable: true })
  correctness: boolean;
}