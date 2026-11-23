import EventList from "./features/events/components/event-list";

function App() {
  return (
    <main className="mx-auto max-w-3xl px-5">
      <header className="pt-12 pb-8">
        <p className="font-display text-2xl font-bold">Wejściówka</p>
        <h1 className="mt-8 font-display text-6xl font-bold leading-none">
          Najbliższe wydarzenia
        </h1>
      </header>
      <EventList></EventList>
    </main>
  );
}

export default App;
