import Fastify from "fastify";
import { pool } from "./db.js";
import { getSavedResponse, reserveIdempotencyKey, saveResponse } from "./idempotency.js";
import { createPayment } from "./payments.js";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  await pool.query("SELECT 1");
  return { ok: true };
});

app.post<{ Body: { amount: number }; Headers: { "idempotency-key"?: string } }>(
  "/payments",
  async (request, reply) => {
    const { amount } = request.body;
    const idempotencyKey = request.headers["idempotency-key"];

    if (!idempotencyKey) {
      return reply.status(400).send({ error: "Missing Idempotency-Key header" });
    }

    const isFirstRequest = await reserveIdempotencyKey(idempotencyKey);

    if (!isFirstRequest) {
      const savedResponse = await getSavedResponse(idempotencyKey);

      if (savedResponse) {
        return savedResponse;
      }

      return reply.status(409).send({ error: "Payment in progress" });
    }

    const response = await createPayment(amount);
    await saveResponse(idempotencyKey, response);

    return response;
  },
);

await app.listen({ port: 3000 });
