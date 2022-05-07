import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side } from 'src/constants/gather.common';

@Entity()
export class Product extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Warehouse, w => w.structures)
  // Warehouse where the Product belongs
  warehouse: Warehouse

  @Column()
  // Product Name
  name: string;

  @Column()
  // Visual Tag of Product to be used during scanning
  code: string;

  @Column()
  // SKU
  sku: string;

  @Column()
  // UPC
  upc: string;

  @Column({ nullable: true })
  // Brief about product
  description: string;

  @Column({ nullable: true })
  // Number of items per Pallet
  itemsPerPallet: number;

  @Column({ nullable: true })
  // Average outflow of product per month
  monthlyUsage: number;
}