"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { IconSelector, IconLogout, IconUser, IconSettings, IconMoon, IconSunHigh, IconSwitch2 } from "@tabler/icons-react";

export function UserProfile() {
  const { state, isMobile } = useSidebar();

  const isSidebarCollapsed = state === "collapsed" && !isMobile;

  const nim = "246151004";
  const namaLengkap = "Gemah Suwailma Ghozali Absyafa";
  const fotoProfil = "https://github.com/shadcn.png";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted h-auto" />}>
            <Avatar size="lg">
              <AvatarImage src={fotoProfil} alt={namaLengkap} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight space-y-0.5">
              <span className="truncate font-medium">{namaLengkap}</span>
              <span className="truncate text-xs text-muted-foreground">{nim}</span>
            </div>
            <IconSelector className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isSidebarCollapsed ? "right" : "top"}
            sideOffset={isSidebarCollapsed ? 24 : 16}
            className={cn(isSidebarCollapsed && "w-48")}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Pilihan Tema Aplikasi</DropdownMenuLabel>
              <DropdownMenuItem>
                <IconSettings />
                Sistem
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconMoon />
                Gelap
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSunHigh />
                Terang
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Menu Akun</DropdownMenuLabel>
              <DropdownMenuItem>
                <IconUser />
                Profil Pengguna
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconSwitch2 />
                Switch Role
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
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
