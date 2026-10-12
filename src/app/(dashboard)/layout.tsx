import { requireSession } from "@/libs/dal";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { getAuthenticatedUserData } from "@/features/auth/queries";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const [session, user] = await Promise.all([requireSession(), getAuthenticatedUserData()]);

  return (
    <SidebarProvider>
      <DashboardSidebar session={session} user={user} />
      <SidebarInset>
        <DashboardHeader />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
