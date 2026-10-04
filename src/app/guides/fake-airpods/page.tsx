import { AccessoryHub, accessoryMetadata } from "@/components/AccessoryHub";
import { FAKE_AIRPODS_GUIDE } from "@/lib/market/accessory-hubs";

export const metadata = accessoryMetadata(FAKE_AIRPODS_GUIDE);

export default function Page() {
  return <AccessoryHub page={FAKE_AIRPODS_GUIDE} />;
}
