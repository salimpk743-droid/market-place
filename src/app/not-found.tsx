import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page max-w-lg text-center">
      <p className="section-kicker">404</p>
      <h1 className="mt-2 text-2xl sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-sm text-muted">That address is not a listing or a page on Mobile Market.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/phones" className="btn btn-primary">
          Used phones
        </Link>
        <Link href="/accessories" className="btn btn-ghost">
          Accessories
        </Link>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </main>
  );
}
