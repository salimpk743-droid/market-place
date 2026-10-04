import { AccessoryHub, accessoryMetadata } from "@/components/AccessoryHub";
import { AIRPODS_HUB } from "@/lib/market/accessory-hubs";

export const metadata = accessoryMetadata(AIRPODS_HUB);

export default function Page() {
  return <AccessoryHub page={AIRPODS_HUB} />;
}
