"use client";

import Link from "next/link";
import React from "react";
import { UserProfile } from "@/components/layouts/user-profile";
import { SidebarLogo } from "./sidebar-logo";
import { roleSidebarMenus } from "./dashboard-sidebar-menus";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarMenus = roleSidebarMenus["Mahasiswa"];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <SidebarLogo />
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
                    render={
                      <Link href={item.url}>
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
        <UserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
