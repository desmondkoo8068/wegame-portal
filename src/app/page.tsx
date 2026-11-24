/**
 * Home page.
 *
 * Temporary placeholder sections so the sticky navbar and footer can be
 * tested. The hero slider and game sections replace these in step 3.
 */
export default function Home() {
  return (
    <main className="flex-1">
      <section className="container-page flex min-h-[70vh] flex-col justify-center gap-4 py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">WeGame</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
          Play better together.
        </h1>
        <p className="max-w-xl text-muted">Hero slider coming in step 3.</p>
      </section>
      <section className="container-page min-h-[80vh] py-24">
        <div className="h-full rounded-xl border border-dashed border-line p-8 text-muted">
          Game sections coming in step 3. Scroll to see the navbar turn solid.
        </div>
      </section>
    </main>
  );
}
