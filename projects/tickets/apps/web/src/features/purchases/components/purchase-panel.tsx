import { useId, useState } from "react";
import { formatPrice, formatTickets } from "../../../lib/format";
import type { EventDto } from "../../events/api/get-events";
import { useCreatePurchase } from "../api/create-purchase";
import { getPurchaseError } from "../api/purchase-error";
import { PurchaseConfirmation } from "./purchase-confirmation";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

interface PurchasePanelProps {
  event: EventDto;
  onCancel: () => void;
}

export function PurchasePanel({ event, onCancel }: PurchasePanelProps) {
  const quantityLabelId = useId();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID(),
  );
  const purchase = useCreatePurchase();

  const totalCents = event.priceCents * quantity;
  const error = purchase.isError ? getPurchaseError(purchase.error) : null;

  const startNewAttempt = (nextQuantity: number) => {
    setQuantity(nextQuantity);
    setIdempotencyKey(crypto.randomUUID());
    purchase.reset();
  };

  const changeQuantity = (next: number) => startNewAttempt(next);

  const pay = () => {
    purchase.mutate({ eventId: event.id, quantity, idempotencyKey });
  };

  if (purchase.isSuccess) {
    return (
      <div className="mt-4 border-t border-ink/10 pt-4">
        <PurchaseConfirmation
          purchase={purchase.data}
          onBuyAgain={() => startNewAttempt(MIN_QUANTITY)}
        />
      </div>
    );
  }

  return (
    <div
      className="mt-4 border-t border-ink/10 pt-4"
      data-idempotency-key={idempotencyKey}
    >
      <div className="flex flex-wrap items-center gap-4">
        <span id={quantityLabelId}>Liczba biletów</span>

        <div
          role="group"
          aria-labelledby={quantityLabelId}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            aria-label="Zmniejsz liczbę biletów"
            disabled={purchase.isPending || quantity <= MIN_QUANTITY}
            onClick={() => changeQuantity(quantity - 1)}
            className="size-9 rounded-md border border-ink/20 font-display text-xl disabled:opacity-40"
          >
            −
          </button>
          <output className="w-8 text-center font-display text-2xl font-semibold">
            {quantity}
          </output>
          <button
            type="button"
            aria-label="Zwiększ liczbę biletów"
            disabled={purchase.isPending || quantity >= MAX_QUANTITY}
            onClick={() => changeQuantity(quantity + 1)}
            className="size-9 rounded-md border border-ink/20 font-display text-xl disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <p className="mt-3 text-muted">
        {formatTickets(quantity)}, razem{" "}
        <span className="font-semibold text-ink">
          {formatPrice(totalCents)}
        </span>
      </p>

      <div aria-live="polite">
        {error && <p className="mt-3 text-stamp">{error.message}</p>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {error?.canRetry !== false && (
          <button
            disabled={purchase.isPending}
            type="button"
            onClick={pay}
            className="rounded-md bg-ink px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {purchase.isPending
              ? "Płacę…"
              : error
                ? "Spróbuj ponownie"
                : `Zapłać ${formatPrice(totalCents)}`}
          </button>
        )}
        <button
          disabled={purchase.isPending}
          type="button"
          onClick={onCancel}
          className="text-muted underline underline-offset-4 disabled:opacity-40"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}
