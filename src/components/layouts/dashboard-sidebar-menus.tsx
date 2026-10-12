import { Role } from "@/types";
import { IconLayoutGrid, IconUsers, IconClipboardText, IconBook, IconFileDescription } from "@tabler/icons-react";

export type SidebarMenuItem = {
  title: string;
  url: string;
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
        title: "Dashboard",
        url: "/mahasiswa",
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
        title: "Dashboard",
        url: "/dosen-capstone-project",
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
        title: "Dashboard",
        url: "/dosen-pembimbing",
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
        title: "Dashboard",
        url: "/kaprodi",
        icon: <IconLayoutGrid />,
      },
      {
        title: "Daftar Dosen",
        url: "/kaprodi/daftar-dosen",
        icon: <IconLayoutGrid />,
      },
      {
        title: "Daftar Mahasiswa",
        url: "/kaprodi/daftar-mahasiswa",
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

export function getActiveSidebarMenu(segments: string[], sidebarMenus: SidebarMenuGroup[]) {
  const activePath = "/" + segments.join("/");

  const menuItems = sidebarMenus.flatMap((group) => group.items);

  const menuItemUrls = menuItems.map((item) => item.url);

  const matchedUrls = menuItemUrls.filter((url) => activePath === url || activePath.startsWith(url + "/"));

  const sortedUrls = matchedUrls.sort((a, b) => b.length - a.length);

  return sortedUrls[0];
}
