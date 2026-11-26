const API_URL = 'http://localhost:3000/api';
const MISSING_EVENT_ID = '00000000-0000-4000-8000-000000000000';

type PurchaseBody = {
  purchaseId?: string;
  quantity?: number;
  amountCents?: number;
  message?: string | string[];
};

type Result = { status: number; body: PurchaseBody };

let failures = 0;

function check(name: string, ok: boolean, details: unknown): void {
  if (!ok) failures++;
  console.log(`${ok ? '✅' : '❌'} ${name}`);
  if (!ok) console.log('   ', JSON.stringify(details));
}

async function purchase(
  eventId: string,
  body: Record<string, unknown>,
  headers: Record<string, string>,
): Promise<Result> {
  const res = await fetch(`${API_URL}/events/${eventId}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: (await res.json()) as PurchaseBody };
}

const withKey = (key: string) => ({ 'Idempotency-Key': key });

function countStatuses(results: Result[]): Record<number, number> {
  return results.reduce<Record<number, number>>((acc, { status }) => {
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});
}

function uniquePurchaseIds(results: Result[]): Set<string> {
  return new Set(
    results
      .map((r) => r.body.purchaseId)
      .filter((id): id is string => id !== undefined),
  );
}

// Retries after 402 (randomly declined payment) with the same key, like a real client would.
async function purchaseUntilPaid(eventId: string, key: string, quantity: number): Promise<Result> {
  for (let attempt = 1; attempt <= 10; attempt++) {
    const result = await purchase(eventId, { quantity }, withKey(key));
    if (result.status !== 402) return result;
  }
  throw new Error('10 declined payments in a row - check FakePaymentGateway');
}

async function main(): Promise<void> {
  const eventsRes = await fetch(`${API_URL}/events`);
  const events = (await eventsRes.json()) as { id: string; name: string }[];
  const event = events[0];
  if (!event) throw new Error('No events in the database');
  console.log(`Test event: ${event.name} (${event.id})\n`);

  // 1. Sequential: retries with the same key get the same response.
  {
    const key = crypto.randomUUID();
    const first = await purchaseUntilPaid(event.id, key, 2);
    const retries: Result[] = [];
    for (let i = 0; i < 5; i++) retries.push(await purchase(event.id, { quantity: 2 }, withKey(key)));
    const all = [first, ...retries];
    check(
      'Sequential: 6 × 201, single purchaseId',
      all.every((r) => r.status === 201) && uniquePurchaseIds(all).size === 1,
      { statuses: countStatuses(all), ids: [...uniquePurchaseIds(all)] },
    );
  }

  // 2. Concurrent: one request is processed, the rest get 409.
  {
    const key = crypto.randomUUID();
    const all = await Promise.all(
      Array.from({ length: 20 }, () => purchase(event.id, { quantity: 1 }, withKey(key))),
    );
    const statuses = countStatuses(all);
    const processed = (statuses[201] ?? 0) + (statuses[402] ?? 0);
    check(
      'Concurrent: 1 × (201 or 402) + 19 × 409, at most one purchaseId',
      processed === 1 && statuses[409] === 19 && uniquePurchaseIds(all).size <= 1,
      { statuses },
    );
  }

  // 3. Same key, different body → 422.
  {
    const key = crypto.randomUUID();
    await purchaseUntilPaid(event.id, key, 2);
    const other = await purchase(event.id, { quantity: 5 }, withKey(key));
    check('Same key, different quantity → 422', other.status === 422, other);
  }

  // 4. Input validation → 400.
  {
    const cases: [string, Promise<Result>][] = [
      ['missing header', purchase(event.id, { quantity: 1 }, {})],
      ['key too long', purchase(event.id, { quantity: 1 }, withKey('x'.repeat(256)))],
      ['quantity = 0', purchase(event.id, { quantity: 0 }, withKey(crypto.randomUUID()))],
      ['quantity = 11', purchase(event.id, { quantity: 11 }, withKey(crypto.randomUUID()))],
      ['extra amountCents field', purchase(event.id, { quantity: 1, amountCents: 1 }, withKey(crypto.randomUUID()))],
      ['eventId is not a uuid', purchase('abc', { quantity: 1 }, withKey(crypto.randomUUID()))],
    ];
    for (const [name, request] of cases) {
      const result = await request;
      check(`Validation: ${name} → 400`, result.status === 400, result);
    }
  }

  // 5. Missing event → 404, and the retry is 404 too (the key was released, not stuck with 409).
  {
    const key = crypto.randomUUID();
    const first = await purchase(MISSING_EVENT_ID, { quantity: 1 }, withKey(key));
    const retry = await purchase(MISSING_EVENT_ID, { quantity: 1 }, withKey(key));
    check(
      'Missing event → 404, retry → 404',
      first.status === 404 && retry.status === 404,
      { first: first.status, retry: retry.status },
    );
  }

  console.log(failures === 0 ? '\nAll checks passed.' : `\nFailed: ${failures}`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
