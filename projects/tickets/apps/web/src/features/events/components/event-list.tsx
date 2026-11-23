import { useEvents } from "../api/get-events";
import { EventTicket } from "./event-ticket";

export default function EventList() {
  const { data: events, error, isLoading } = useEvents();

  if (isLoading) {
    return <p>Wczytuję wydarzenia...</p>;
  }

  if (error) {
    return (
      <p>
        Nie udało się pobrać wydarzeń. Sprawdź, czy API działa, i odśwież
        stronę.
      </p>
    );
  }

  if (!events || events.length === 0) {
    return <p>Nie znaleziono wydarzeń.</p>;
  }

  return (
    <ul className="space-y-4 pb-16">
      {events.map((event) => (
        <li key={event.id}>
          <EventTicket event={event} />
        </li>
      ))}
    </ul>
  );
}
