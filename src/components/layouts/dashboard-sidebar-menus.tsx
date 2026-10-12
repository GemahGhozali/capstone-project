import { Role } from "@/types";
import { IconLayoutGrid, IconUsers, IconClipboardText, IconBook, IconFileDescription } from "@tabler/icons-react";

export type SidebarMenuItem = {
  url: string;
  title: string;
  icon: React.JSX.Element;
};

export type SidebarMenuGroup = {
  label?: string;
  items: SidebarMenuItem[];
};

const mahasiswaSidebarMenus: SidebarMenuGroup[] = [
  {
    items: [
      {
        url: "/mahasiswa",
        title: "Dashboard",
        icon: <IconLayoutGrid />,
      },
      {
        title: "Kelola Tim",
        url: "/mahasiswa/kelola-tim",
        icon: <IconUsers />,
      },
      {
        title: "Upload Proposal",
        url: "/mahasiswa/proposal",
        icon: <IconClipboardText />,
      },
      {
        title: "Upload Resume",
        url: "/mahasiswa/resume",
        icon: <IconFileDescription />,
      },
      {
        title: "Jadwal Bimbingan",
        url: "/mahasiswa/jadwal-bimbingan",
        icon: <IconBook />,
      },
    ],
  },
];

const dosenCapstoneProjectSidebarMenus: SidebarMenuGroup[] = [
  {
    items: [
      {
        url: "/dosen-capstone-project",
        title: "Dashboard",
        icon: <IconLayoutGrid />,
      },
      {
        title: "Proposal Masuk",
        url: "/dosen-capstone-project/proposal-masuk",
        icon: <IconClipboardText />,
      },
    ],
  },
];

const dosenPembimbingSidebarMenus: SidebarMenuGroup[] = [
  {
    items: [
      {
        url: "/dosen-pembimbing",
        title: "Dashboard",
        icon: <IconLayoutGrid />,
      },
      {
        title: "Resume Masuk",
        url: "/dosen-pembimbing/resume-masuk",
        icon: <IconFileDescription />,
      },
      {
        title: "Jadwal Bimbingan",
        url: "/dosen-pembimbing/jadwal-bimbingan",
        icon: <IconBook />,
      },
    ],
  },
];

const kaprodiSidebarMenus: SidebarMenuGroup[] = [
  {
    items: [
      {
        url: "/kaprodi",
        title: "Dashboard",
        icon: <IconLayoutGrid />,
      },
    ],
  },
];

export const roleSidebarMenus: Record<Role, SidebarMenuGroup[]> = {
  Mahasiswa: mahasiswaSidebarMenus,
  "Dosen Capstone Project": dosenCapstoneProjectSidebarMenus,
  "Dosen Pembimbing": dosenPembimbingSidebarMenus,
  Kaprodi: kaprodiSidebarMenus,
};
