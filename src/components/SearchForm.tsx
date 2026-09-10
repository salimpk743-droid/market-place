import { ALL_BRANDS, CATEGORIES, CITIES } from "@/lib/market/catalog";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/browse" method="get" className={compact ? "" : "card p-4 text-ink sm:p-5"}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <label className="col-span-2 block lg:col-span-2">
          <span className="label">Keyword</span>
          <input name="q" placeholder="iPhone 13, AirPods, charger, cover…" className="input" />
        </label>
        <label className="block">
          <span className="label">Category</span>
          <select name="category" defaultValue="" className="input">
            <option value="">All items</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Brand</span>
          <select name="brand" defaultValue="" className="input">
            <option value="">All brands</option>
            {ALL_BRANDS.map((b) => (
              <option key={b.slug} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">City</span>
          <select name="city" defaultValue="" className="input">
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Max price</span>
          <input name="maxPrice" type="number" min={200} step={500} placeholder="PKR" className="input" />
        </label>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="submit" className="btn btn-primary sm:min-w-40">
          Search
        </button>
        <a href="/sell" className="btn btn-ghost">
          Sell your phone
        </a>
      </div>
    </form>
  );
}
