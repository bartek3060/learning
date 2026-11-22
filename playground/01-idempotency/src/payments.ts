import { pool } from "./db.js";
import type { PaymentResponse } from "./types.js";

const PAYMENT_PROCESSING_DELAY_MS = 300;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createPayment(amount: number): Promise<PaymentResponse> {
  await sleep(PAYMENT_PROCESSING_DELAY_MS);

  const result = await pool.query<{ id: number }>(
    "INSERT INTO payments (amount) VALUES ($1) RETURNING id",
    [amount],
  );
  const id = result.rows.at(0)?.id;

  if (id === undefined) {
    throw new Error("Failed to insert payment");
  }

  return { id, amount };
}
