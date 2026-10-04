import { AccessoryHub, accessoryMetadata } from "@/components/AccessoryHub";
import { USED_AIRPODS_GUIDE } from "@/lib/market/accessory-hubs";

export const metadata = accessoryMetadata(USED_AIRPODS_GUIDE);

export default function Page() {
  return <AccessoryHub page={USED_AIRPODS_GUIDE} />;
}
