import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InventoryItem } from './inventory.item.entity';
import { Mission } from 'src/mission/mission.entity';
import { MissionBin } from 'src/mission/mission.bin.entity';
import { InventoryGallery } from './inventory.gallery.entity';

@Injectable()
export class InventoryGalleryService {
  constructor(
    @InjectRepository(InventoryGallery)
    private readonly inventoryGalleryRepository: Repository<InventoryGallery>,
  ) {}

  getByProduct(productId: number) { 
    return this.inventoryGalleryRepository.find({
      where: {
        inventoryItem: productId
      }
    })
  }
}