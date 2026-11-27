import { isAxiosError } from "axios";

export interface PurchaseError {
  message: string;
  canRetry: boolean;
}

export function getPurchaseError(error: unknown): PurchaseError {
  if (!isAxiosError(error) || !error.response) {
    return { message: "Nie udało się połączyć z serwerem.", canRetry: true };
  }

  switch (error.response.status) {
    case 402:
      return {
        message: "Płatność została odrzucona. Spróbuj ponownie albo użyj innej karty.",
        canRetry: true,
      };
    case 409:
      return {
        message: "Płatność jest w trakcie. Sprawdź za chwilę.",
        canRetry: true,
      };
    case 404:
      return { message: "To wydarzenie nie jest już dostępne.", canRetry: false };
    default:
      return { message: "Coś poszło nie tak. Spróbuj ponownie.", canRetry: true };
  }
}
