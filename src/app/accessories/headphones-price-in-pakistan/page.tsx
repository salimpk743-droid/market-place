import { AccessoryHub, accessoryMetadata } from "@/components/AccessoryHub";
import { HEADPHONES_HUB } from "@/lib/market/accessory-hubs";

export const metadata = accessoryMetadata(HEADPHONES_HUB);

export default function Page() {
  return <AccessoryHub page={HEADPHONES_HUB} />;
}
