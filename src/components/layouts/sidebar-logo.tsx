import { IconSchool } from "@tabler/icons-react";

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 p-0 duration-200 ease-linear group-data-[collapsible=icon]:p-0">
      <div className="size-10 shrink-0 grid place-content-center rounded-md bg-primary/10">
        <IconSchool className="text-primary" size={20} />
      </div>
      <span className="truncate">
        <p className="font-semibold text-sm">Capstone Project</p>
        <p className="text-muted-foreground text-xs">Dosen Capstone Project</p>
      </span>
    </div>
  );
}
