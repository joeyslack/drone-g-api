import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  getAllProductsOfWarehouse(warehouseId: number) {
    return this.productRepository.find({
      where: {
        warehouse: warehouseId
      }
    });
  }

  getProductByCode(sku: string, upc: string) {
    return this.productRepository.findOne({
      where: {
        sku,
        upc
      }
    });
  }

  get(productId: number) {
    return this.productRepository.findOne(productId);
  }
}