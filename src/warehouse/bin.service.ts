import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Structure } from './structure.entity';
import { Bin } from './bin.entity';
import { Warehouse } from './warehouse.entity';

@Injectable()
export class BinService {
  constructor(
    @InjectRepository(Bin)
    private readonly binRepository: Repository<Bin>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  get(id: number) {
    return this.binRepository.findOne(id);
  }

  getWarehouseBins(warehouseId: number) {
    return this.binRepository.createQueryBuilder('bin')
      .leftJoin('bin.structure', 'structure')
      .leftJoin('structure.warehouse', 'warehouse', 'warehouse.id = :warehouseId', {warehouseId})
      .getMany();
  }

  getByCode(code: string) {
    return this.binRepository.findOne({code});
  }

  add(entity: Bin) {
    return this.binRepository.insert(entity);
  }
}