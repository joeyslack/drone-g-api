
import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { StructureService } from './structure.service';
import { BinService } from './bin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { Structure } from './structure.entity';
import { Bin } from './bin.entity';
import { MissionBin } from 'src/mission/mission.bin.entity';
import { VWMissionBin } from 'src/mission/mission.bin.view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, Structure, Bin, MissionBin, VWMissionBin])],
  exports: [TypeOrmModule],
  controllers: [WarehouseController],
  providers: [WarehouseService, StructureService, BinService],
})

export class WarehouseModule {}