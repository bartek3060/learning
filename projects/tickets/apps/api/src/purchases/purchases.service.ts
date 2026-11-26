import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { IdempotencyKey } from './idempotency-key.entity';
import { Event } from '../events/event.entity';
import { DataSource, Repository } from 'typeorm';
import { createHash } from 'node:crypto';
import { FakePaymentGateway } from './fake-payment-gateway';
import { PaymentDeclinedError } from './payment-declined.error';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly fakePaymentGateway: FakePaymentGateway,
    private readonly dataSource: DataSource,

    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(IdempotencyKey)
    private readonly idempotencyKeyRepository: Repository<IdempotencyKey>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  public async create(
    eventId: string,
    idempotencyKey: string,
    quantity: number,
  ) {
    const requestHash = createHash('sha256')
      .update(JSON.stringify({ eventId, quantity }))
      .digest('hex');

    const result = await this.idempotencyKeyRepository
      .createQueryBuilder()
      .insert()
      .into(IdempotencyKey)
      .values({ key: idempotencyKey, requestHash })
      .orIgnore()
      .returning(['key'])
      .execute();

    const isFirstRequest = result.raw.length > 0;

    if (!isFirstRequest) {
      const existingKey = await this.idempotencyKeyRepository.findOne({
        where: { key: idempotencyKey },
      });

      if (existingKey?.requestHash !== requestHash) {
        throw new UnprocessableEntityException(
          'Idempotency key already used with different request data',
        );
      }

      if (existingKey?.response) {
        return existingKey.response;
      } else {
        throw new ConflictException(
          'Idempotency key already used but no response stored',
        );
      }
    }

    try {
      const event = await this.eventRepository.findOne({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const purchase = this.purchaseRepository.create({
        event,
        quantity,
        amountCents: quantity * event.priceCents,
        idempotencyKey,
      });

      const paymentId = await this.fakePaymentGateway.charge(
        purchase.amountCents,
        idempotencyKey,
      );
      purchase.paymentId = paymentId;

      return await this.dataSource.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(purchase);
          const response = {
            purchaseId: purchase.id,
            quantity,
            amountCents: purchase.amountCents,
          };
          await transactionalEntityManager.update(
            IdempotencyKey,
            { key: idempotencyKey },
            { response, statusCode: 201 },
          );
          return response;
        },
      );
    } catch (error) {
      await this.idempotencyKeyRepository.delete({ key: idempotencyKey });

      if (error instanceof PaymentDeclinedError) {
        throw new HttpException(
          'Payment declined',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
      throw error;
    }
  }
}
