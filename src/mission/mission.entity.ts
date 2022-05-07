import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side, MissionStatus } from 'src/constants/gather.common';
import { Product } from '../inventory/product.entity';
import { InventoryItem } from '../inventory/inventory.item.entity';
import { MissionBin } from './mission.bin.entity';
import { Drone } from './drone.entity';
import { v4 as uuidv4 } from 'uuid';

const randomUuid = uuidv4();

@Entity()
export class Mission extends GatherEntity {
  // constructor() {
  //   super();
  // }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Warehouse)
  @JoinColumn()
  // Warehouse mission is running for
  warehouse: Warehouse;

  @ManyToOne(type => Drone, {nullable: true})
  @JoinColumn()
  // Drone assigned to Mission
  drone: Drone;

  @OneToMany(type => MissionBin, mb => mb.mission)
  // Array of selected bins
  bins: MissionBin[];

  @Column({default: randomUuid})
  // Name of Mission
  name: string;

  @Column({type: 'timestamptz'})
  // Mission start date
  date: Date;

  @Column()
  // Directory name of mission files
  directory: string;

  @Column({default: 4})
  // {Scheduled, InFlight, OnHold, Completed, Aborted, Failed}
  status: MissionStatus;

  @Column({type: 'timestamptz'})
  // Time stamp when mission concluded
  completedOn: Date;

  @ManyToOne(type => Mission, m => m.templateMission, {nullable: true})
  // Source Mission Id
  templateMission: Mission;

  @Column({default: 1})
  // To count run of missions
  childrenIndex: number;

  @Column({default: randomUuid})
  // Client reference to relate mission with device data
  clientReference: string;

  @Column({default: false})
  deleted: boolean;

  @Column({ type: "jsonb", nullable: true })
  report: object;
}