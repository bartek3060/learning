import { Injectable } from '@nestjs/common';
import { PaymentDeclinedError } from './payment-declined.error';

@Injectable()
export class FakePaymentGateway {
  public async charge(
    amountCents: number,
    idempotencyKey: string,
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const failureChance = Math.random();

    if (failureChance < 0.3) {
      throw new PaymentDeclinedError();
    }

    return `fake_payment_id_${Math.random().toString(36).substring(2, 15)}`;
  }
}
