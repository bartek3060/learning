import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api-client";

export interface EventDto {
  id: string;
  name: string;
  venue: string;
  startsAt: string;
  createdAt: string;
}

const getEvents = async ({
  signal,
}: {
  signal: AbortSignal;
}): Promise<EventDto[]> => {
  const response = await api.get<EventDto[]>("/events", { signal });
  return response.data;
};

export const useEvents = () =>
  useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents({ signal }),
  });
