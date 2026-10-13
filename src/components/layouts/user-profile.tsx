"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { useLogout } from "@/features/auth/hooks";
import { ThemeToggler } from "./theme-toggler";
import { RoleSwitcher } from "./role-switcher";
import { SessionPayload } from "@/libs/session";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { AuthenticatedUserData } from "@/features/auth/types";
import { IconSelector, IconLogout } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

interface UserProfileProps {
  session: SessionPayload;
  user: AuthenticatedUserData;
}

export function UserProfile({ session, user }: UserProfileProps) {
  const { mutate: logout } = useLogout();

  const { state, isMobile } = useSidebar();

  const isSidebarCollapsed = state === "collapsed" && !isMobile;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted h-auto" />}>
            <Avatar size="lg">
              <AvatarImage src={user.fotoProfil || ""} alt={user.namaLengkap} />
              <AvatarFallback>{generateNameInitials(user.namaLengkap)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight space-y-1">
              <span className="truncate font-medium">{user.namaLengkap}</span>
              <span className="truncate text-xs text-muted-foreground">{user.identifier}</span>
            </div>
            <IconSelector className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isSidebarCollapsed ? "right" : "top"}
            sideOffset={isSidebarCollapsed ? 24 : 16}
            className={cn(isSidebarCollapsed && "w-48")}
          >
            <ThemeToggler />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {session.roles.length > 1 && <RoleSwitcher session={session} />}
              <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
