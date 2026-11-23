import type { EventDto } from "../api/get-events";

const day = new Intl.DateTimeFormat("pl-PL", { day: "numeric" });
const month = new Intl.DateTimeFormat("pl-PL", { month: "short" });
const hourMinute = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
});
const weekday = new Intl.DateTimeFormat("pl-PL", { weekday: "long" });

export function EventTicket({ event }: { event: EventDto }) {
  const startsAt = new Date(event.startsAt);

  return (
    <article className="grid grid-cols-[6.5rem_1fr] rounded-md bg-white">
      <time
        dateTime={event.startsAt}
        className="flex flex-col items-center justify-center rounded-l-md bg-ticket py-4 font-display"
      >
        <span className="text-6xl font-bold leading-none">
          {day.format(startsAt)}
        </span>
        <span className="text-xl">{month.format(startsAt)}</span>
        <span className="mt-2 text-xl font-semibold">
          {hourMinute.format(startsAt)}
        </span>
      </time>

      <div
        className="relative border-l-2 border-dashed border-ink/20 px-5 py-4
        before:absolute before:-top-3 before:left-[-0.8rem] before:size-6 before:rounded-full before:bg-paper
        after:absolute after:-bottom-3 after:left-[-0.8rem] after:size-6 after:rounded-full after:bg-paper"
      >
        <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
          {event.name}
        </h2>
        <p className="mt-1 text-muted">{event.venue}</p>
        <p className="text-muted">{weekday.format(startsAt)}</p>
      </div>
    </article>
  );
}
