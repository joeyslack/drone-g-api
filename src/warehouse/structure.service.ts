import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, AdvancedConsoleLogger } from 'typeorm';
import { Structure } from './structure.entity';
import { Warehouse } from './warehouse.entity';
import { async } from 'rxjs/internal/scheduler/async';
import { Side, StructureTypes } from 'src/constants/gather.common';
import { MissionBin } from 'src/mission/mission.bin.entity';
import { VWMissionBin } from 'src/mission/mission.bin.view.entity';
import { Bin } from './bin.entity';

class StructureResponse {
  constructor(data?) {
    // if (data.children && data.children.length > 0) {
    //   data.children = data.children.m
    // }
    return {
      id: data.id || data.binId || 0,
      code: data.clientLocation || data.code || null,
      label: data.title || data.name || null,
      typeName: StructureTypes[data.structureType] || (data.structureId ? "Bin" : null) || null,
      hasScanned: data.isScanned || (!data.id ? true : false) || false,
      hasChanged: data.isChanged || false,
      hasError: data.hasError || false,
      side: Side[data.side] || "Unknown",
      index: data.position || 0,
      // itemCount: parseInt(data.itemCount) || (data.children && data.children.length ? data.children.length + 0 : 1) || 1,
      itemCount: parseInt(data.itemCount) || (data.children && data.children.length ? 1 : 0) || 0,
      imageUrl: data.imageUrl || data.thumbnailImage || data.thumbnailPath || null,
      children: data.children || null,
      metadata: data.metadata || {},
    }
  }
}

class WarehouseStructureResponse {
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
export class StructureService {
  constructor(
    @InjectRepository(Structure)
    private readonly structureRepository: Repository<Structure>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(VWMissionBin)
    private readonly missionBinRepository: Repository<VWMissionBin>,
    @InjectRepository(Bin)
    private readonly binRepository: Repository<Bin>
  ) {}

  async getById (id: number) {
    return await this.structureRepository.findOneOrFail(id);
  }

  async get (code, type) {
    return await this.structureRepository.findOneOrFail({
      where: {
        code,
        structureType: type,
      }
    });
  }

  // Wrap children in StructureResponse, recursively
  processChildren(objects, bins = []) {
    return objects.map(object => {
      if (object.children && object.children.length > 0) {
        // Still have children, not a bin yet
        object.children = this.processChildren(object.children, bins);
        // Children of children scanned?
        object.isScanned = object.children.filter(rack => rack.children.filter(bin => bin.hasScanned).length > 0).length > 0;
      }
      // No more children, check for bins. This should be a RACK
      else if (object.children.length <= 0) {
        object.children = bins.filter(b => b.structureId === object.id).map(o => new StructureResponse(o));        
        object.isScanned = object.children && object.children.length > 0 && object.children.map(c => c.hasScanned).length > 0;
        object.itemCount = object.children.map(o => o.itemCount).reduce((sum, current) => sum + current, 0);
      }

      return new StructureResponse(object);       
    });
  }
  
  // GET /warehouse/structure
  async getWarehouseStructure(warehouse, bins = []) {
    // const warehouse = await this.warehouseRepository.findOne(warehouseId || null);
    const levelCount:number = warehouse && warehouse.levels ? warehouse.levels : 0;
    const manager = getManager();

    // May have to use roots/findDescendatsTree if findTrees() spins.... memory limit, using findDescendantTrees would allow us 
    // to work on a single root at a time.
    // const roots = await manager.getTreeRepository(Structure).findRoots();
    // const objects = [];
    // for (const root of roots) {
    //   objects.push(await manager.getTreeRepository(Structure).findDescendantsTree(root));
    // };

    const objects = await manager.getTreeRepository(Structure).findTrees(); 
    const nestedStructures = new StructureResponse({children: this.processChildren(objects, bins)});
    
    // Fix counts for Aisles only
    if (nestedStructures && nestedStructures.hasOwnProperty('children') && nestedStructures['children'].length > 0) {
      const aisleCountTotals = this.count(nestedStructures['children']);
      nestedStructures['children'].forEach((e, index) => {
        e.itemCount = aisleCountTotals[index];
      });
      nestedStructures['itemCount'] = aisleCountTotals.reduce((sum, current) => sum + current, 0);
    }

    return new WarehouseStructureResponse({
      "levelCount": levelCount,
      "structure": nestedStructures
    });
  }

  count(object) {
    return object.map(aisle => aisle.children.map(rack => rack.itemCount).reduce((sum, current) => sum + current, 0));
  }

  // Find warehouseId before calling getWarehouseStructure
  // A root warehouse must be chosen, so we take the first one
  async getAllStructures(warehouseId = null): Promise<any> {
    const warehouse = await this.warehouseRepository.findOne({ where: warehouseId ? { id: warehouseId } : null });

    // Get actual bins for structure building
    const bins = await this.binRepository.find();
    
    if (!warehouse || !bins || bins.length <= 0) {
      throw ('Warehouse and valid missionBin required');
    }

    return await this.getWarehouseStructure(warehouse, bins);
  }
  
  // Get structures by missionId
  // /missions/:missionId/structure
  async getStructureByMissionId(missionId, warehouseId = null): Promise<any> {
    // Get warehouse from missionId (1 mission = 1 warehouse)
    const warehouse = await this.warehouseRepository.findOneOrFail({ where: warehouseId ? { id: warehouseId } : null });
    // Get missions bin (actually vw_mission_bin, includes meta relationship, and image in view)
    const bins = await this.missionBinRepository.find({ where: { missionId } });
    if (!warehouse || !bins || bins.length <= 0) {
      throw ('Warehouse and valid missionBin required');
    }

    // Get all structures...and populate...
    const structures = await this.getWarehouseStructure(warehouse, bins);

    // Get Get all mission_bin
    // Fill in child data with mission_bin data
    return structures;
  }



  add(structure: Structure) {
    return this.structureRepository.insert(structure);
  } 

  getMissionRacks(missions) {
    return {};
  }

  // getMissionRacks(missions) {
  //   return this.structureRepository.
  // }

  // getMissionBin(missionId: number) {
  //   return this.structureRepository.findOne(missionId);
  // }

  getMissionBin(missionId: number) { 
    return {};
  }

}