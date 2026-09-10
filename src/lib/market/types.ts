export const LISTING_STATUSES = ["active", "sold", "removed", "pending_moderation"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const PUBLIC_LISTING_COLUMNS = [
  "id",
  "category",
  "brand",
  "model",
  "storage_gb",
  "ram_gb",
  "price_pkr",
  "city_slug",
  "area",
  "pta_status",
  "battery_health",
  "condition",
  "description",
  "color",
  "year",
  "image_url",
  "seller_name",
  "status",
  "featured",
  "created_at",
  "updated_at",
  "slug",
] as const;

export const OWNER_LISTING_COLUMNS = ["seller_id", ...PUBLIC_LISTING_COLUMNS] as const;

export type PublicListing = {
  id: string;
  seller_id?: string | null;
  category: string;
  brand: string;
  model: string;
  storage_gb: number | null;
  ram_gb: number | null;
  price_pkr: number;
  city_slug: string;
  area: string | null;
  pta_status: string;
  battery_health: number | null;
  condition: string | null;
  description: string | null;
  color: string | null;
  year: number | null;
  image_url: string | null;
  seller_name: string | null;
  status: ListingStatus;
  featured: boolean;
  created_at: string;
  updated_at: string | null;
  slug: string | null;
};

export type OwnerListing = PublicListing & {
  contact_phone?: string;
};

export type ListingFilters = {
  q?: string;
  brand?: string;
  city?: string;
  area?: string;
  pta?: string;
  storage?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  category?: string;
  page?: string;
};

export type ListingImageRow = {
  id: string;
  listing_id: string;
  public_url?: string;
  storage_path?: string;
  sort_order: number;
};

export type ListingImage = {
  id: string;
  url: string;
};
