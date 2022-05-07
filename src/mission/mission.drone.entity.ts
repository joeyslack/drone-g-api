import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side, MissionStatus } from 'src/constants/gather.common';
import { Product } from '../inventory/product.entity';
import { InventoryItem } from '../inventory/inventory.item.entity';
import { Mission } from './mission.entity';
import { Bin } from 'src/warehouse/bin.entity';

@Entity()
export class MissionDrone extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(type => Bin)
  @JoinColumn()
  // Selected Bin
  bin: Bin;

  @ManyToOne(type => Mission)
  @JoinColumn()
  // Mission bin is selected for
  mission: Mission;

  @Column()
  // Indicator of Selection
  isSelected: boolean;

  @Column()
  // Indicator of Scanned
  isScanned: boolean;

  @Column()
  // Indicator of Change
  isChanged: boolean;

  @Column()
  // Indicator of Error
  hasError: boolean;

  @Column()
  // Scanning remarks / Error description
  notes: boolean;

  @OneToMany(type => InventoryItem, i => i.missionBin)
  // List of inventory in bin
  inventoryItems: InventoryItem[];

  @Column()
  // Time when bin was scanned
  scannedOn: Date;
}