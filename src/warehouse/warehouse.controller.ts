import { Controller, Get, Post, Param } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { StructureService } from './structure.service';
import { warehouseStructureMock } from '../helpers/warehouse.structure.mock';

@Controller()
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly structureService: StructureService,
  ) {}

  @Get('warehouse/metrics')
  findMetrics(): any {
    return this.warehouseService.getMetrics();
  }

  @Get('warehouse/stats/:days')
  findStatsByDays(@Param('days') days): any {
    return this.warehouseService.getStats(days);
  }

  @Get('warehouse/configuration')
  findConfiguration() {
    // return this.warehouseService.getConfiguration();
    // TODO: Use mock injection here to load static config path... for local testing
    return this.warehouseService.getConfiguration();
  }

  @Get('import')
  importAndFindConfiguration() {
    // TODO: Fix the processor before finalizing this external method... maybe should be queued instead?
    return 'not implemented';
  }

  @Post('import/inventory')
  importInventory() {
    return 'not implemented';
  }

  @Post('import/state')
  importState() {
    return 'not implemented';
  }

  @Get('warehouse/structure')
  async findWarehouseStructure(): Promise<any> {
    return this.structureService.getAllStructures();
    // return this.structureService.getWarehouseStructure(100004);
    // return warehouseStructureMock;
  }

  @Get('/missions/:missionId/structure')
  async getStructureByMissionId(@Param('missionId') missionId: number): Promise<any> {
    return await this.structureService.getStructureByMissionId(missionId);
  }
}
