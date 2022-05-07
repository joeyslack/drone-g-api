import { Controller, Get, Post, Param, Request, HttpCode } from '@nestjs/common';
import { InventoryItemService } from './inventory.item.service';

@Controller('warehouse')
export class InventoryController {
   constructor(
    private readonly inventoryService: InventoryItemService,
  ) {}

  @Get('metrics')
  findMetrics() {
    return { route: 'warehouse/metrics' }
  }

  @Get('stats/:days')
  findStatsByDays() {
    return { route: 'warehouse/stats/days' }
  }

  @Get('configuration')
  findConfiguration() {
    return { route: 'configuraiton' }
  }

  @Get('import')
  importAndFindConfiguration() {
    return { route: 'import'}
  }

  @Post('import/inventory')
  importInventory() {
    return { route: 'import/inventory' }
  }

  @Post('import/state')
  importState() {
    return { route: 'import/state' }
  }

  @Get('stucture')
  findWarehouseStructure() {
    return { route: 'warehouse/structure' }
  }

  @Get('inventory/validate/:itemId')
  @HttpCode(200)
  async checkInventoryValidation(@Param('itemId') itemId) {
    return await this.inventoryService.checkVerification(itemId);
  }

  @Post('inventory/validate')
  @HttpCode(200)
  async validateInventory(@Request() req) {
    return await this.inventoryService.updateVerification(req.body);
  }
}
