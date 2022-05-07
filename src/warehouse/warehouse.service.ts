import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';

class StatsResponse {
  constructor(data) {
    data['additionalData'] = null;
    
    return {
      timeStamp: new Date,
      responseCode: "Success",
      validationErrorsList: [],
      response: data
    }
  }
}

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>
  ) {}


  get(id: number) {
    return this.warehouseRepository.findOne(id);
  }

  async getMetrics() {
    const data = await this.warehouseRepository.query(`select 1 as id, "structureTotal", "structureChanged", "structureTotal"-"structureChanged" as "structureUnchanged", COALESCE(NULLIF("structureChanged",0) / NULLIF("structureTotal",0), 0) * 100 "changePercentage", round(("structureScanned" * 5) / 60)::integer as "manHoursSaved"
from (select count(distinct b."structureId")::integer "structureTotal", count(distinct case when mb."binId" is not null and mb."isChanged"=true then b."structureId" else null end)::integer as "structureChanged", count( case when mb."binId" is not null  then b."structureId" else null end)::integer as "structureScanned"
 from bin b
 left Join mission_bin mb on mb."binId"= b.id and mb."rowStatus"<>3 left join mission m on mb."missionId"=m.id and m."rowStatus"<>3) wh;`);

    return new StatsResponse(data[0]);
  }

  getConfiguration() {
    // return this._dbContext.Configurations.ToList();
    return {
      "timeStamp": "2020-03-06T04:21:00.2324757+00:00",
      "responseCode": "Success",
      "validationErrorsList": [],
      "response": {
        "additionalData": {
          "useFtp": "true",
          "structureName": "Racks",
          "csV_IN_FTP": "true",
          "title": "Benek"
        }
      }
    }
  }

  async getStats(days: number): Promise<StatsResponse> {
    // return this.warehouseRepository.query("call get_rack_chartdata(@p_days);")
    const data = await this.warehouseRepository.query(`select 1 as id, count( case when mb."isScanned"=true and mb."isChanged"=true  then b."structureId" else null end)::integer as "structureChanged",
count( case when mb."isScanned"=true and mb."isChanged"=false and mb."hasError"=false then b."structureId" else null end)::integer as "structureUnchanged",
       count( case when mb."isScanned"=true then b."structureId" else null end)::integer as "structureScanned", 
        count( case when mb."isScanned"=true and  mb."hasError"=true then b."structureId" else null end)::integer as "structureError" 
from mission m 
inner join mission_bin mb on mb."missionId" = m.id and m.date >= now()-interval '` + days + ` day'
inner join bin b on b.id = mb."binId" where m."rowStatus"<>3;`);

    return new StatsResponse(data[0]);
  }
}