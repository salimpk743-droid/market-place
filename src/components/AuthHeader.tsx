import { Header } from "@/components/Header";
import { getCurrentUser } from "@/lib/market/listings";

export async function AuthHeader() {
  const { user } = await getCurrentUser();
  return <Header email={user?.email} />;
}
