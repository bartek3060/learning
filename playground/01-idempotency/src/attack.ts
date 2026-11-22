const PAYMENTS_URL = "http://localhost:3000/payments";
const REQUEST_COUNT = 20;

type AttackResult = {
  status: number;
  body: { id?: number; amount?: number; error?: string };
};

const mode = process.argv[2] === "seq" ? "sequential" : "concurrent";
const idempotencyKey = crypto.randomUUID();

async function sendPayment(): Promise<AttackResult> {
  const res = await fetch(PAYMENTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ amount: 100 }),
  });
  return { status: res.status, body: await res.json() };
}

async function sendSequentially(count: number): Promise<AttackResult[]> {
  const results: AttackResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(await sendPayment());
  }
  return results;
}

function sendConcurrently(count: number): Promise<AttackResult[]> {
  return Promise.all(Array.from({ length: count }, () => sendPayment()));
}

function printSummary(results: AttackResult[]): void {
  const statusCounts = results.reduce<Record<number, number>>((acc, { status }) => {
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  const uniquePaymentIds = new Set(
    results.map((r) => r.body.id).filter((id) => id !== undefined),
  );

  console.log(`mode: ${mode}, requests: ${results.length}`);
  console.log("statuses:", statusCounts);
  console.log("unique payment ids:", uniquePaymentIds.size);
}

const results =
  mode === "sequential"
    ? await sendSequentially(REQUEST_COUNT)
    : await sendConcurrently(REQUEST_COUNT);

printSummary(results);
