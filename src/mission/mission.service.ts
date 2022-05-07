import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, MoreThanOrEqual, LessThanOrEqual, Between, Like, FindOperator, FindManyOptions } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionInventory } from './mission.inventory.entity';
import * as moment from 'moment';
import { VWMissionBin } from './mission.bin.view.entity';
import { InventoryItem } from 'src/inventory/inventory.item.entity';
import { concat } from 'rxjs';

class MissionStructureResponse {
  constructor(data) {
    return {
      timeStamp: new Date(),
      responseCode: "Success",
      validationErrorsList: [],
      response: data
    };
  }
}

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    @InjectRepository(MissionInventory)
    private readonly missionInventory: Repository<MissionInventory>,
    @InjectRepository(VWMissionBin)
    private readonly missionBinRepository: Repository<VWMissionBin>
  ) {}

  // findAll(): Promise<Mission[]> {
  //   return this.missionRepository.find();
  // }

  // findOne(id: string): Promise<Mission> {
  //   return this.missionRepository.findOne(id);
  // }

  // async remove(id: string): Promise<void> {
  //   await this.missionRepository.delete(id);
  // }

  async getById(id: number): Promise<MissionStructureResponse> {
    return new MissionStructureResponse({ missions: await this.missionRepository.findOne(id) });                                                                                                                  
  }

  // Serves /missions endpoint
  // /missions?pagesize=9&pagenumber=1&period=lastdays&days=30&sortby=Mission&sortdirection=desc
  async getAll(query) {
    const take = parseInt(query.pagesize) || 10;
    const order = {};
    const where = {};
    const mappings = {
      mission: 'name',
      'Mission': 'name',
      date: 'completedOn',
      time: 'completedOn',
      'rack-changed': 'date', //modifiedOn?
      'racks-changed': 'date'
    }

    where['deleted'] = false;
    
    if (query.sortby && mappings[query.sortby]) { 
      order[mappings[query.sortby]] = query.sortdirection.toUpperCase() || 'DESC';

      // add secondary sorting when "Mission"
      if (query.sortby.toLowerCase() === "mission") {
        order['date'] = query.sortdirection.toUpperCase() || 'DESC';
      }
    }
    if (query.period && query.period === 'lastdays') { 
      where['completedOn'] = Between(moment().subtract(parseInt(query.days) || 30, 'days'), moment());
    } 

    const params = {
      take,
      skip: (parseInt(query.pagenumber) - 1 || 0) * take,
      order,
      where
    }

    let [missions, count] = await this.missionRepository.findAndCount({...params});
    missions = missions.map(item => {
      // Frontend requires specific naming
      return {
        ...item,
        createdOn: item.completedOn,
        missionId: item.id,
        missionName: item.name,
        changeCount: 0,
        runCounter: 1,
        parentMissionId: 0
      };
    });

    return new MissionStructureResponse({
      missions,
      totalRecords: count,
      pageSize: take,
      pageNumber: parseInt(query.pagenumber) || 1,
      totalPages: count && (count > take) ? Math.ceil(count / take) : 1,
      hasMoreData: count > (take * (query.pagenumber || 1)),
      additionalData: null
    });
  }

  // Serves /missions/inventory/{query} endpoint
  // ?pagesize=30&pagenumber=1&period=lastdays&days=30&sortby=date&sortdirection=desc&missionId=282
  // TODO: Create helper method for params, to share 'find' parameter building with method above
  async getMissionInventory(query) {
    const take = parseInt(query.pagesize) || 10;
    query.sortdirection = query.sortdirection ? query.sortdirection.toUpperCase() : 'DESC';
    // const where = query.missionId && query.missionId !== "undefined" ? { missionId: parseInt(query.missionId) } : null;
    const order = {};
    const where = {};
    const mappings = {
      'Product': 'productName',
      'product': 'productName',
      'bin-code': 'binCode',
      'Condition': 'condition',
      'condition': 'condition',
      'scan-on': 'scannedOn',
      date: 'scannedOn',
      'Date': 'scannedOn'
    }

    if (query.missionId) {
      where['missionId'] = parseInt(query.missionId);
    }

    if (query.binID) {
      // return await this.getImagesByMissionBinId(query.missionId, query.binID);
      where['binId'] = parseInt(query.binID);
    }

    if (query.binId) {
      // return await this.getImagesByMissionBinId(query.missionId, query.binID);
      where['binId'] = parseInt(query.binId);
    }

    if (query.sortby && mappings.hasOwnProperty(query.sortby)) { 
      order[mappings[query.sortby]] = query.sortdirection || 'DESC'; 
    } else  {
      order['productName'] = 'DESC';
      order['scannedOn'] = 'DESC';
    }
    if (query.period && query.period === 'lastdays') { 
      where['completedOn'] = Between(moment().subtract(parseInt(query.days) || 30, 'days'), moment());
    }
    
    const params = {
      take,
      skip: (parseInt(query.pagenumber) - 1 || 0) * take,
      order: order,
      where
    }
    
    // SPECIAL HANDLING FOR NO MISSION, FULL INVENTORY LIST
    // Used when no mission specified, "All" items.
    const productList = {};
    if (!query.missionId) {
      // Search handling
      if (query.search) {
        params['where'] = 'LOWER(CONCAT("binCode", "productCode", "productName")) LIKE \'%' + query.search.toLowerCase() + '%\'';
        params['take'] = 999;
        params['skip'] = 0;
      }

      let [results, count] = await this.missionInventory.findAndCount(params);
      // Results processing...
      results.forEach(p => {
        let key = p.productId + '_' + p.binCode;

        // Special handling for Empty
        if (p.productName === "Empty") {
          key = p.productName + '_' + p.productCode + '_' + p.binCode;
          if (productList[key] && productList[key].hasOwnProperty('quantity')) {
            p.quantity = productList[key]['quantity'] += p.quantity;
          }
          else p.quantity = 0;

          productList[key] = p;
        }

        // Only add unique keys to list
        if (!productList[key]) {
          // p.quantity = productList[key]['quantity'] += p.quantity;
          productList[key] = p;
        }
      });

      // Convert productList into array for output 
      const products = Object.keys(productList).map((key, index) => {
        return { ...productList[key], "productId": null }
      });

      count = products.length;
      const pageNumber = parseInt(query.pagenumber) || 1;
      return await new MissionStructureResponse({
        products: products.slice((pageNumber - 1) * take, ((pageNumber - 1) * take) + take),
        // products: products,
        totalRecords: count,
        pageSize: take,
        pageNumber: parseInt(query.pagenumber) || 1,
        totalPages: 1,
        hasMoreData: count > (take * (query.pagenumber || 1)),
        additionalData: null
      });
    }
    
    const [results, count] = await this.missionInventory.findAndCount(params);
    // Reducer, we want only UNIQUE PRODUCTS per LOCATION. 
    // We group, and count quantities for accumulator quantity score
    /*results.forEach(p => {
      const key = p.productId + '_' + p.binCode;
      if (productList[key]) {
        p.quantity = productList[key]['quantity'] += p.quantity;
      }

      productList[key] = p;
    });*/

    // const products = Object.keys(productList).map(key => {
    const products = results.map(item => {
      return {
        ...item,
        "productId": null, // frontend tries to use productId as unique key, better to null, and have front end default to another selector
      }
    }).filter((val) => { return val !== null;});

    // count = products.length;
    return await new MissionStructureResponse({
      products: products,
      totalRecords: count,
      pageSize: take,
      pageNumber: parseInt(query.pagenumber) || 1,
      totalPages: count && (count > take) ? Math.ceil(count / take) : 1,
      hasMoreData: count > (take * (query.pagenumber || 1)),
      additionalData: null
    });
  }

  async getImagesByMissionBinId(missionId, binId) {
    return new MissionStructureResponse({
      images: await (await this.missionBinRepository.find({ where: {missionId: missionId, binId: binId} })).map(a => {return {captureTime: a.scannedOn, imageUrl: a.thumbnailPath}})
    })
  }

  async downloadCSV(missionId) {
    const response = await (await this.missionInventory.find({ where: {missionId: missionId} })).map(m => {
      return `${m.productName},${m.productCode},${m.quantity},${m.daysLeft},${m.description},${m.binCode},${m.isChanged},${m.hasError},${m.scannedOn}`
    }).join('"\n"');
    
    return {
      "timeStamp": new Date(),
      "responseCode": "Success",
      "validationErrorsList": [],
      "response": {
        "missionCSV": [
          "SKU,UPC/GTIN,Total Unit Count,Days of Inventory Left,Description,Location,Bin changed,Scan Error,Date Scanned",
          response
        ]
      }
    }
  }

  // Soft delete only
  async deleteMission(missionId) {
    const m = await this.missionRepository.findOne(missionId);
    m.deleted = true;
    return await this.missionRepository.save(m);
  }

  getByClientRef(clientReference: string) {
    return this.missionRepository.findOne({clientReference});
  }

  getAllByCreatedOn(from: Date, to: Date) {
    return this.missionRepository.find({
      where: {
        date: Between(from, to),        
      }
    });
  }

  getAllByCompletedOn(from: Date, to: Date) {
    return this.missionRepository.find({
      where: {
        completedOn: Between(from, to),        
      }
    });
  }

  getWithStructureByCreatedOn(from: Date, to: Date) {
    return this.missionRepository.find({
      where: {
        date: Between(from, to),        
      }
    })
  }
}