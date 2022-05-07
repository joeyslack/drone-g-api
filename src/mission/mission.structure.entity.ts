import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany, ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';
import { GatherEntity } from 'src/helpers/gather.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { StructureTypes, Side, MissionStatus, RowStatus } from 'src/constants/gather.common';
import { Product } from '../inventory/product.entity';
import { InventoryItem } from '../inventory/inventory.item.entity';
import { Mission } from './mission.entity';
import { Bin } from 'src/warehouse/bin.entity';
import { BindOptions } from 'dgram';

@ViewEntity({
  expression: `SELECT
   "m"."id" AS "missionId",
   "m"."warehouseId" AS "warehouseId",
   "m"."name" AS "name",
   "m"."date" AS "date",
   "m"."status" AS "missionStatusId",
   "m"."createdOn" AS "createdOn",
   "m"."rowStatus" AS "rowStatus",
   "m"."templateMissionId" AS "templateMissionId",
   "m"."childrenIndex" AS "childrenIndex",
   "m"."completedOn" AS "completedOn",count(distinct (case when ("mb"."isChanged" = true) then "b"."structureId" else NULL end)) AS "structureChangeCount"
FROM (("mission" "m" join "mission_bin" "mb" on((("mb"."missionId" = "m"."id") and ("m"."rowStatus" <> 3)))) join "bin" "b" on(("b"."id" = "mb"."binId"))) group by "m"."id";`
})

export class MissionStructure {
  @ViewColumn()
  missionId: number;

  @ViewColumn()
  warehouseId: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  date: Date;

  @ViewColumn()
  missionStatus: string;

  @ViewColumn()
  createdOn: Date;

  @ViewColumn()
  rowStatus: RowStatus;

  @ViewColumn()
  templateMissionId: string;

  @ViewColumn()
  childrenIndex: number;

  @ViewColumn()
  structureChangeCount: number;
}