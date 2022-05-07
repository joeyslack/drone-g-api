import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn, ManyToMany, ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';

@ViewEntity({
  expression: `SELECT
   "b"."id" AS "binId",
   "b"."structureId" AS "structureId",
   "b"."side" AS "side",
   "b"."name" AS "name",
   "b"."position" AS "position",
   "b"."clientLocation" AS "clientLocation",
   "b"."code" AS "code",
   "mb"."id" AS "missionBinId",
   "mb"."missionId" AS "missionId",
   "mb"."isSelected" AS "isSelected",
   "mb"."isScanned" AS "isScanned",
   "mb"."isChanged" AS "isChanged",
   "mb"."hasError" AS "hasError",
   "mb"."notes" AS "notes",
   "mb"."scannedOn" AS "scannedOn",
   "it"."thumbnailPath" AS "thumbnailPath",
   "it"."itemCount" AS "itemCount"
  FROM (("bin" "b" join "mission_bin" "mb" on((("mb"."binId" = "b"."id") and ("mb"."rowStatus" <> 3)))) join (select "it"."missionBinId" AS "missionBinId",max("ig"."thumbnailPath") AS "thumbnailPath",count(distinct "it"."id") AS "itemCount" from ("inventory_item" "it" left join "inventory_gallery" "ig" on(("ig"."id" = "it"."inventoryGalleryId"))) group by "it"."missionBinId") "it" on(("mb"."id" = "it"."missionBinId")))
`})

export class VWMissionBin {
  @ViewColumn()
  binId: number;

  @ViewColumn()
  structureId: number;

  @ViewColumn()
  side: number;

  @ViewColumn()
  name: string;
  
  @ViewColumn()
  position: string;
  
  @ViewColumn()
  clientLocation: string;

  @ViewColumn()
  code: string;

  @ViewColumn()
  missionBinId: number;

  @ViewColumn()
  missionId: number;

  @ViewColumn()
  isSelected: boolean;
  
  @ViewColumn()
  isScanned: boolean;

  @ViewColumn()
  isChanged: boolean;

  @ViewColumn()
  hasError: boolean;

  @ViewColumn()
  notes: string;

  @ViewColumn()
  scannedOn: Date;
  
  @ViewColumn()
  thumbnailPath: string;

  @ViewColumn()
  itemCount: number;
}