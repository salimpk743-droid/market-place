import { ALL_BRANDS, BRANDS, CATEGORIES, CITIES, CONDITIONS, PTA, STORAGE_OPTIONS, getCity, isPhoneCategory } from "@/lib/market/catalog";
import type { ListingFilters } from "@/lib/market/types";

export function FilterForm({
  filters,
  action = "/browse",
  lockedCategory,
}: {
  filters: ListingFilters;
  action?: string;
  lockedCategory?: string;
}) {
  const city = filters.city ? getCity(filters.city) : undefined;
  const phoneLike = isPhoneCategory(lockedCategory || filters.category);
  const brands = phoneLike && (lockedCategory === "phone" || lockedCategory === "phones") ? BRANDS : ALL_BRANDS;
  return (
    <form className="card mb-6 p-4 sm:p-5" method="get" action={action}>
      <p className="mb-3 text-sm font-semibold text-ink">Refine results</p>
      {lockedCategory ? <input type="hidden" name="category" value={lockedCategory} /> : null}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <label className="col-span-2 block sm:col-span-1">
          <span className="label">Keyword</span>
          <input name="q" defaultValue={filters.q || ""} placeholder="Model, AirPods, charger…" className="input" />
        </label>
        {lockedCategory ? null : (
          <label className="block">
            <span className="label">Category</span>
            <select name="category" defaultValue={filters.category || ""} className="input">
              <option value="">All items</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          <span className="label">Brand</span>
          <select name="brand" defaultValue={filters.brand || ""} className="input">
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        {phoneLike ? (
          <label className="block">
            <span className="label">Storage</span>
            <select name="storage" defaultValue={filters.storage || ""} className="input">
              <option value="">Any</option>
              {STORAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n === 1024 ? "1 TB" : `${n} GB`}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {phoneLike ? (
          <label className="block">
            <span className="label">PTA status</span>
            <select name="pta" defaultValue={filters.pta || ""} className="input">
              <option value="">Any</option>
              {PTA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block">
          <span className="label">City</span>
          <select name="city" defaultValue={filters.city || ""} className="input">
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Area</span>
          <select name="area" defaultValue={filters.area || ""} className="input" disabled={!city}>
            <option value="">{city ? "All areas" : "Pick a city first"}</option>
            {(city?.areas || []).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Condition</span>
          <select name="condition" defaultValue={filters.condition || ""} className="input">
            <option value="">Any</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Max price (PKR)</span>
          <input name="maxPrice" type="number" min={200} defaultValue={filters.maxPrice || ""} className="input" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-primary">Apply filters</button>
        <a href={action} className="btn btn-ghost">
          Clear
        </a>
      </div>
    </form>
  );
}
