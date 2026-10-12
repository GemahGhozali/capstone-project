import { requireSession } from "@/libs/dal";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const session = await requireSession();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
