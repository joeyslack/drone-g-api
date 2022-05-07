import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './mission.entity';
import { MissionService } from './mission.service';
import { UsersService } from './user.service';
import { DroneService } from './drone.service';
import { MissionBin } from './mission.bin.entity';
import { MissionBinService } from './mission.bin.service';
import { Drone } from './drone.entity';
import { InventoryItemService } from 'src/inventory/inventory.item.service';
import { InventoryItem } from 'src/inventory/inventory.item.entity';
import { MissionInventory } from './mission.inventory.entity';
import { VWMissionBin } from './mission.bin.view.entity';
import { ReportService } from './report.service';
// import { WarehouseService } from './warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, MissionBin, Drone, InventoryItem, MissionInventory, VWMissionBin])],
  exports: [TypeOrmModule],
  controllers: [MissionController],
  providers: [MissionService, InventoryItemService, DroneService, MissionBinService, ReportService],
})

export class MissionModule {}