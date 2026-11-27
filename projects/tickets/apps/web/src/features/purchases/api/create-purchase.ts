import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";

export interface PurchaseDto {
  purchaseId: string;
  quantity: number;
  amountCents: number;
}

export interface CreatePurchaseInput {
  eventId: string;
  quantity: number;
  idempotencyKey: string;
}

const createPurchase = async ({
  eventId,
  quantity,
  idempotencyKey,
}: CreatePurchaseInput): Promise<PurchaseDto> => {
  const response = await api.post<PurchaseDto>(
    `/events/${eventId}/purchases`,
    { quantity },
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
  return response.data;
};

export const useCreatePurchase = () =>
  useMutation({
    mutationFn: createPurchase,
  });
