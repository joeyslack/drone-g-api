import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, MoreThanOrEqual, LessThanOrEqual, Between, Like, FindOperator, FindManyOptions } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionInventory } from './mission.inventory.entity';
import * as moment from 'moment';
import { VWMissionBin } from './mission.bin.view.entity';
import { InventoryItem } from 'src/inventory/inventory.item.entity';
import { concat } from 'rxjs';
import fs = require('fs');
import { ApiProperty, ApiParam } from '@nestjs/swagger';


// const report = JSON.parse(fs.readFileSync('db.json','utf8'));

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
  ) {}

  getMissionReportByDirectory(directory, params) {
    return this.getReportByDirectory(directory);
  }

  async getItemsFromMissionReport(directory, params) {
    const report = await this.getReportByDirectory(directory);
    return report['items'];
  }

  async getItemFromMissionReportByItemId(directory, itemId) {
    const report = await this.getReportByDirectory(directory);
    const items = report['items'];

    return items.filter(e => {
      return e.inventoryItemId === itemId;
    })[0]
  }


  async insertOrUpdate(directory, newReport) {
   return await this.saveMissionReport(directory, newReport);
  }

  async insertOrUpdateItems(directory, items) {
    const report = await (await this.missionRepository.findOne({directory})).report;
    const newReport = {...report, ...items};
    return await this.saveMissionReport(directory, newReport);
  }

  async insertOrUpdateItemByItemId(directory, json) {
    const report = await this.getReportByDirectory(directory);
    const items = report['items'];
    const itemsHash = {};

    // items.forEach(element => {
    //   itemsHash[element.inventoryItemId] = json.inventoryItemId === element.inventoryItemId ? json : element;
    // });

    items.map(e => {
      return e.inventoryItemId === json.inventoryItemId ? json : e;
    });

    console.log(items, '--newitems');

    const newReport = {...report, ...items};
    return await this.saveMissionReport(directory, newReport);
  }



  async getReportByDirectory(directory) {
    return await (await this.missionRepository.findOne({directory})).report;
  }

  async saveMissionReport(directory, newReport) {
    let m = await this.missionRepository.findOne({directory});
    m.report = newReport;
    return await this.missionRepository.save(m);
  }
}