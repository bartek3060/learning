import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreatePurchaseDto } from './create-purchase.dto';
import { Headers } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
@Controller('events/:eventId/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Body() dto: CreatePurchaseDto,
  ) {
    if (!idempotencyKey) {
      throw new BadRequestException('Missing idempotency key');
    }

    if (idempotencyKey.length > 255) {
      throw new BadRequestException('Idempotency key is too long');
    }

    return this.purchasesService.create(eventId, idempotencyKey, dto.quantity);
  }
}
