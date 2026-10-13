"use client";

import { useTheme } from "next-themes";
import { IconMoon, IconSettings, IconSunHigh } from "@tabler/icons-react";
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../ui/dropdown-menu";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Pilihan Tema Aplikasi</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="system">
          <IconSettings />
          Sistem
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">
          <IconMoon />
          Gelap
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="light">
          <IconSunHigh />
          Terang
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  );
}
