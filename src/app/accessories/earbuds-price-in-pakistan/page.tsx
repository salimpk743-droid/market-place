import { AccessoryHub, accessoryMetadata } from "@/components/AccessoryHub";
import { EARBUDS_HUB } from "@/lib/market/accessory-hubs";

export const metadata = accessoryMetadata(EARBUDS_HUB);

export default function Page() {
  return <AccessoryHub page={EARBUDS_HUB} />;
}
