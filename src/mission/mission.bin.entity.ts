import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side, MissionStatus } from 'src/constants/gather.common';
import { Product } from '../inventory/product.entity';
import { InventoryItem } from '../inventory/inventory.item.entity';
import { Mission } from './mission.entity';
import { Bin } from 'src/warehouse/bin.entity';

@Entity()
export class MissionBin extends GatherEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @JoinColumn()
  @ManyToOne(type => Bin)
  bin: Promise<Bin>;

  @JoinColumn()
  @ManyToOne(type => Mission)
  mission: Promise<Mission>;

  @Column({default: true})
  isSelected: boolean;

  @Column({default: true})
  isScanned: boolean;

  @Column({default: false})
  isChanged: boolean;

  @Column({default: false})
  hasError: boolean;

  @Column({nullable: true, default: ''})
  notes: string;

  @Column({type: 'timestamptz'})
  scannedOn: Date;

  @OneToMany(type => InventoryItem, i => i.missionBin)
  @JoinColumn()
  // Mission bin is selected for
  inventoryItems: Promise<InventoryItem[]>;
}