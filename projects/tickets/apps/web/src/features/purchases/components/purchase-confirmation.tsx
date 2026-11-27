import { formatPrice, formatTickets } from "../../../lib/format";
import type { PurchaseDto } from "../api/create-purchase";

interface PurchaseConfirmationProps {
  purchase: PurchaseDto;
  onBuyAgain: () => void;
}

export function PurchaseConfirmation({
  purchase,
  onBuyAgain,
}: PurchaseConfirmationProps) {
  return (
    <div role="status">
      <p className="font-display text-2xl font-semibold">
        Kupiono {formatTickets(purchase.quantity)}
      </p>
      <p className="mt-1 text-muted">
        Zapłacono {formatPrice(purchase.amountCents)}. Numer zakupu:{" "}
        <span className="text-ink">
          {purchase.purchaseId.slice(0, 8).toUpperCase()}
        </span>
      </p>

      <button
        type="button"
        onClick={onBuyAgain}
        className="mt-4 rounded-md border border-ink/30 px-4 py-2 font-semibold"
      >
        Kup kolejne
      </button>
    </div>
  );
}
