import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/session-server";

export default async function RootPage() {
  const token = await getAccessToken();
  redirect(token ? "/dashboard" : "/login");
}
