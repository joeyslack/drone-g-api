import { Injectable, HttpCode } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product } from './product.entity';
import { InventoryItem } from './inventory.item.entity';
import { Mission } from 'src/mission/mission.entity';
import { MissionBin } from 'src/mission/mission.bin.entity';
import * as fetch from 'node-fetch';

class InventoryStructure {
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
export class InventoryItemService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
  ) {}

  getById(inventoryItemId: number) {
    return this.inventoryItemRepository.findOne(inventoryItemId);
  }

  getByMission(missionId: number, invItemCode?: string) { 
    // let mission = this.missionRepository.findOne(missionId);
    return this.missionRepository
      .createQueryBuilder('mission')
      .leftJoin('mission.bins', 'mb')
      .leftJoinAndSelect('mb.binId', 'inventory_item.missionBinId')
      .where("mission.id = :missionId", {missionId})
      .andWhere("inventory_item.code = :invItemCode", {invItemCode})
      .getMany();
  }

  add(entity: InventoryItem) {
    return this.inventoryItemRepository.insert(entity);
  }

  // // azurewebsites.net/missions/inventory?pagesize=30&pagenumber=1&period=lastdays&days=30&sortby=date&sortdirection=desc&missionId=282
  // async getAll(params?) {
  //   const pagesize = params.pagesize || 30;
  //   const skip = (params.pagenumber || 1) * pagesize;
  //   const order = { name: params.sortby, id: params.sortdirection };
  //   const where = params.missionId ? { missionId: params.missionId } : {};
  //   // TODO: Add days filtering
    
  //   // return await new InventoryStructure({ products: await this.inventoryItemRepository.findAndCount(params) });
  //   const results = await this.missionInventory.findAndCount({take: pagesize, skip, order, where});

  //   return await new InventoryStructure({ 
  //     products: results,
  //     totalRecords: results[1],
  //     pageSize: pagesize,
  //     totalPages: results[1] ? results[1] / pagesize : 1,
  //     hasMoreData: results[1] > pagesize,
  //     additionalData: null
  //   });
  // }

  get(fromDate, toDate) {
    return this.getByMissionDate(fromDate, toDate);
  }

  async getByProductId(productId) {
    return new InventoryStructure({
      "images": await (await this.inventoryItemRepository.find({ where: { productId }, relations: ["inventoryGallery"] })).map(a => {return {captureTime: a.inventoryGallery.captureTime, imageUrl: a.inventoryGallery.imagePath}})
    });
  }

  getByMissionDate(fromDate: Date, toDate: Date) {
    return this.inventoryItemRepository.findAndCount({
      where: {
        createdOn: Between(fromDate, toDate)
      }
    });
  }

  getByMissionID(missionId) {
    return this.missionRepository.find({
      where: {
        id: missionId
      }
    });
  }

  // Check verification on item
  async checkVerification({uuid: itemId}) {
    if (!itemId) {
      return HttpCode(404);
    }

    return await this.inventoryItemRepository.findOne({uuid: itemId});
  }

  // Verify single inventory item
  async updateVerification(item) {
    console.log(item, '-updateVerification-');

    if (!item || !item.inventoryId) {
      return HttpCode(404);
    }

    const i = await this.inventoryItemRepository.findOne({uuid: item.inventoryId});

    i.correctness = item.correctness;
    i.verifiedRecord = true;
    i.verificationDate = item.verificationDate;
    i.verificationSource = item.verificationSource;
    
    return await this.inventoryItemRepository.save(i);
  }

  // // Handle update verification via api
  // // Designed to process multiple items
  // async updateVerification(itemsHash) {
  //   console.log(itemsHash, '---req');

  //   const items = [];
  //   const promises = [];

  //   Object.keys(itemsHash).forEach(key => {
  //     const i = itemsHash[key];
  //     i.id = i.inventoryId;
  //     items.push(i);
  //     promises.push(this.inventoryItemRepository.save(i));
  //   });

  //   return Promise.all(promises);


  //   // 2. Sync /w Azure
  //   // return await fetch(process.env.PROCESS_HOST + '/api/UpdateVerification', {method: 'POST', body: 'hello'}, () => {
  //   // // name=hello&mission=20200520T142727-0400-0d93fe74&container=larry-gather-test&items=' + JSON.stringify(req), { method: 'POST' }, {
  //   //   console.log('hi');
  //   // });

  //   // console.log(req, '-UpdateVerification^^-');
  //   // return await fetch(process.env.PROCESS_HOST + '/api/UpdateVerification?name=hello&mission=20200520T142727-0400-0d93fe74&container=larry-gather-test&items=' + JSON.stringify(req), { method: 'POST' })
    
  //   // Get request.

  //   // Update local SQL
    
  //   // Write remote changes
  //   // return req;
  // }
}