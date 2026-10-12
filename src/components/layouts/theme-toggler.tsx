import { IconMoon, IconSettings, IconSunHigh } from "@tabler/icons-react";
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "../ui/dropdown-menu";

export function ThemeToggler() {
  return (
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
  );
}
