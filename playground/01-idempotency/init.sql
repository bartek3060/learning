CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE idempotency_keys (
  key TEXT PRIMARY KEY,
  response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
