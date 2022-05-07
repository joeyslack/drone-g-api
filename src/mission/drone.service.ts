import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Mission } from './mission.entity';
import { Drone } from './drone.entity';

@Injectable()
export class DroneService {
  constructor(
    @InjectRepository(Drone)
    private readonly droneRepository: Repository<Drone>,
  ) {}

  get(clientRef: string, warehouseId: number) {
    return this.droneRepository.findOne({
      where: {
        warehouseId,
      }
      // TODO: It looks like there used to be something called "Code Ref"
      // It looks like it was removed in newer API spec, but still in old code..
      // Not sure if it was ever used.
    });
  }
}