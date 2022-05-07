import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';

@ViewEntity({
  expression: `SELECT
  CONCAT("m"."id", "i"."id") as "id",
  "m"."date" AS "date",
  "m"."name" AS "missionName",
  "mb"."scannedOn" AS "scannedOn",
  "mb"."isChanged" AS "isChanged",
  "mb"."hasError" AS "hasError",
  "b"."clientLocation" AS "binCode",
  "b"."id" AS "binId",
  "p"."name" AS "productName",
  "p"."code" AS "productCode",
  "p"."id" AS "productId",
  "p"."description" as "description",
  "p"."upc" AS "upc",
  "i"."notes" AS "notes",
  "i"."id" AS "inventoryId",
  "i"."quantity" AS "quantity",
  "i"."condition" AS "condition",
  "i"."daysLeft" AS "daysLeft",
  "i"."verifiedRecord" AS "verifiedRecord",
  "i"."verificationDate" AS "verificationDate",
  "i"."verificationSource" AS "verificationSource",
  "i"."correctness" AS "correctness",
  "m"."id" AS "missionId",
  (SELECT "g"."thumbnailPath"
    FROM "inventory_gallery" "g" 
    WHERE ("g"."id" = "i"."inventoryGalleryId") limit 1) AS "imageUrl" 
  FROM (((("mission" "m" join "mission_bin" "mb" on((("m"."id" = "mb"."missionId") and ("mb"."rowStatus" <> 3)))) join "inventory_item" "i" on(("mb"."id" = "i"."missionBinId"))) join "bin" "b" on(("mb"."binId" = "b"."id"))) join "product" "p" on(("i"."productId" = "p"."id")))
  WHERE "m"."deleted" = 'false';
  `})

export class MissionInventory {
  @ViewColumn()
  @PrimaryColumn()
  id: number;

  @ViewColumn()
  date: Date;

  @ViewColumn()
  missionName: string;

  @ViewColumn()
  scannedOn: Date;

  @ViewColumn()
  isChanged: boolean;

  @ViewColumn()
  hasError: boolean;

  @ViewColumn()
  binCode: string;

  @ViewColumn()
  binId: number;

  @ViewColumn()
  productName: string;

  @ViewColumn()
  productCode: string;

  @ViewColumn()
  productId: number;

  @ViewColumn()
  description: string;

  @ViewColumn()
  upc: string;

  @ViewColumn()
  notes: string;

  @ViewColumn()
  inventoryId: number;

  @ViewColumn()
  quantity: number;

  @ViewColumn()
  condition: string;

  @ViewColumn()
  daysLeft: number;

  @ViewColumn()
  missionId: number;

  @ViewColumn()
  imageUrl: string;

  @ViewColumn()
  verificationDate: Date;

  @ViewColumn()
  verificationSource: string;

  @ViewColumn()
  verifiedRecord: boolean;

  @ViewColumn()
  correctness: boolean;
}