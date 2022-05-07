import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { InventoryItemService } from './inventory.item.service';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly itemService: InventoryItemService ) {}

  @Get('products/:productId/images')
  async getProductImagesById(@Param('productId') productId): Promise<any> {
    return await this.itemService.getByProductId(productId);
  }
}