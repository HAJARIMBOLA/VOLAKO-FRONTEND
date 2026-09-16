import "server-only";
import { backendFetch } from "../backend";
import { withAuth } from "./helpers";
import type { Dashboard } from "../types";

export function getDashboard(from?: string, to?: string): Promise<Dashboard> {
  return withAuth((token) =>
    backendFetch<Dashboard>("/api/dashboard", { accessToken: token, searchParams: { from, to } })
  );
}
