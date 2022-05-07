import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionBin } from './mission.bin.entity';

@Injectable()
export class MissionBinService {
  constructor(
    @InjectRepository(MissionBin)
    private readonly missionBinRepository: Repository<MissionBin>,
  ) {}

  get(missionBinId: number) {
    return this.missionBinRepository.findOne(missionBinId);
  }

  getByMissionID(missionId: number) {
    return this.missionBinRepository.findOne(missionId);
  }

  add(entity: MissionBin) {
    return this.missionBinRepository.insert(entity);
  }
}