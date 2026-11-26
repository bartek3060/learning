import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { Purchase } from './purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyKey } from './idempotency-key.entity';
import { Event } from '../events/event.entity';
import { FakePaymentGateway } from './fake-payment-gateway';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, FakePaymentGateway],
  imports: [TypeOrmModule.forFeature([Purchase, IdempotencyKey, Event])],
})
export class PurchasesModule {}
