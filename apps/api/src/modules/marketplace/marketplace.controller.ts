import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';

@ApiTags('marketplace')
@Controller('api/v1/marketplace')
export class MarketplaceController {
  constructor(private readonly svc: MarketplaceService) {}

  @Get('products')
  @ApiOperation({ summary: 'List products available for sale' })
  findProducts(@Query('mrfId') mrfId?: string, @Query('productType') productType?: string) {
    return this.svc.findProducts({ mrfId, productType });
  }

  @Post('products')
  @ApiOperation({ summary: 'List a new product in the marketplace' })
  createProduct(@Body() body: {
    mrfId: string;
    productType: string;
    name: string;
    description?: string;
    unitPriceINR: number;
    availableQty: number;
    unit?: string;
    grade?: string;
    photoUrl?: string;
  }) {
    return this.svc.createProduct(body);
  }

  @Patch('products/:id/stock')
  @ApiOperation({ summary: 'Update product stock quantity' })
  updateStock(@Param('id') id: string, @Body() body: { availableQty: number }) {
    return this.svc.updateStock(id, body.availableQty);
  }

  @Get('orders')
  @ApiOperation({ summary: 'List all sale orders' })
  findOrders(@Query('status') status?: string, @Query('buyerType') buyerType?: string) {
    return this.svc.findOrders({ status, buyerType });
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place a new sale order from GP/PWD/contractor' })
  createOrder(@Body() body: {
    buyerName: string;
    buyerType: string;
    buyerContact: string;
    deliveryAddress: string;
    createdBy: string;
    notes?: string;
    items: { productId: string; quantity: number; productionRunId?: string }[];
  }) {
    return this.svc.createOrder(body);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get a sale order by ID' })
  findOrder(@Param('id') id: string) {
    return this.svc.findOrder(id);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update sale order status' })
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.svc.updateOrderStatus(id, body.status);
  }

  @Post('orders/:id/delivery')
  @ApiOperation({ summary: 'Record delivery receipt' })
  recordDelivery(@Param('id') id: string, @Body() body: {
    receivedBy: string;
    receivedQty: number;
    condition: string;
    evidenceUrl?: string;
    notes?: string;
  }) {
    return this.svc.recordDelivery(id, body);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Marketplace sales statistics' })
  stats() {
    return this.svc.stats();
  }
}
