import { pool } from "./db.js";
import type { PaymentResponse } from "./types.js";

export async function reserveIdempotencyKey(key: string): Promise<boolean> {
  const result = await pool.query(
    "INSERT INTO idempotency_keys (key) VALUES ($1) ON CONFLICT (key) DO NOTHING RETURNING key",
    [key],
  );
  return result.rows.length > 0;
}

export async function getSavedResponse(key: string): Promise<PaymentResponse | null> {
  const result = await pool.query<{ response: PaymentResponse | null }>(
    "SELECT response FROM idempotency_keys WHERE key = $1",
    [key],
  );
  return result.rows.at(0)?.response ?? null;
}

export async function saveResponse(key: string, response: PaymentResponse): Promise<void> {
  await pool.query("UPDATE idempotency_keys SET response = $2 WHERE key = $1", [
    key,
    response,
  ]);
}
