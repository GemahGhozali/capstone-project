import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PageBreadcrumbs } from "./page-breadcrumbs";

export function DashboardHeader() {
  return (
    <header className="flex p-3 shrink-0 items-center gap-2 border-b sticky top-0 bg-sidebar z-50">
      <div className="flex items-center gap-2">
        <SidebarTrigger size="icon-lg" />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <PageBreadcrumbs />
      </div>
    </header>
  );
}
