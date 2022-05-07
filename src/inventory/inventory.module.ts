
import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { InventoryGalleryService } from './inventory.gallery.service';
import { InventoryItemService } from './inventory.item.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryGallery } from './inventory.gallery.entity';
import { InventoryItem } from './inventory.item.entity';
import { Mission } from 'src/mission/mission.entity';
// import { WarehouseService } from './warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, InventoryGallery, InventoryItem, Mission])],
  exports: [TypeOrmModule],
  controllers: [InventoryController, ProductController],
  providers: [ProductService, InventoryGalleryService, InventoryItemService],
})
export class InventoryModule {}