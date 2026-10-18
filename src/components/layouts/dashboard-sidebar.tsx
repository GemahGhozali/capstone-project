"use client";

import Link from "next/link";
import { UserProfile } from "@/components/layouts/user-profile";
import { SidebarLogo } from "./sidebar-logo";
import { SessionPayload } from "@/libs/session";
import { AuthenticatedUserData } from "@/features/auth/types";
import { useSelectedLayoutSegments } from "next/navigation";
import { getActiveSidebarMenu, roleSidebarMenus } from "./dashboard-sidebar-menus";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  session: SessionPayload;
  user: AuthenticatedUserData;
}

export function DashboardSidebar({ session, user }: DashboardSidebarProps) {
  const segments = useSelectedLayoutSegments();

  const sidebarMenus = roleSidebarMenus[session.currentRole];

  const activeSidebarMenu = getActiveSidebarMenu(segments, sidebarMenus);

  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarLogo session={session} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarMenus.map((group, index) => (
          <SidebarGroup key={index}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.url === activeSidebarMenu}
                    render={
                      <Link
                        href={item.url}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserProfile session={session} user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
