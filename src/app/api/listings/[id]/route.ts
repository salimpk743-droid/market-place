import { NextResponse } from "next/server";
import { getListingById, getListingImages } from "@/lib/market/listings";
import { assertNoPrivateListingFields } from "@/lib/market/public-fields";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || id.length > 80) {
    return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  }
  const listing = await getListingById(id);
  if (!listing || listing.status === "removed") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const images = await getListingImages(id);
  const payload = {
    listing,
    images,
  };
  assertNoPrivateListingFields(payload);
  return NextResponse.json(payload);
}
