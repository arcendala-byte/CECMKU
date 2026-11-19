import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper";
import { requireAdmin } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Protect the route on the server
  await requireAdmin();

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
