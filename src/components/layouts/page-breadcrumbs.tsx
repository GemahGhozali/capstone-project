"use client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { z } from "zod";
import { Button } from "../ui/button";
import { Fragment } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import { roleSidebarMenus, SidebarMenuItem } from "./dashboard-sidebar-menus";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const allSidebarMenuItems: SidebarMenuItem[] = Object.values(roleSidebarMenus).flatMap((groups) => groups.flatMap((group) => group.items));

const segmentTitles = Object.fromEntries(
  allSidebarMenuItems.map((item) => {
    const lastURLPath = item.url.split("/").at(-1);
    return [lastURLPath, item.title];
  }),
);

const segmentLabels = { ...segmentTitles, tambah: "Tambah Data", edit: "Edit Data" };

function isNotUUIDSegment(segment: string) {
  return !z.uuid().safeParse(segment).success;
}

function removeDynamicUUIDSegment(segments: string[]) {
  return segments.filter((segment) => isNotUUIDSegment(segment));
}

export function PageBreadcrumbs() {
  const rawSegments = useSelectedLayoutSegments();
  const segments = removeDynamicUUIDSegment(rawSegments);

  const breadcrumbItems = segments.map((segment, index) => ({
    url: `/${segments.slice(0, index + 1).join("/")}`,
    title: segmentLabels[segment] as string,
  }));

  const currentPage = breadcrumbItems.at(-1);
  const collapsedBreadcrumbItems = breadcrumbItems.slice(0, -1);

  return (
    <>
      {/* Mobile Breadcrumbs */}
      <Breadcrumb className="md:hidden">
        <BreadcrumbList>
          {collapsedBreadcrumbItems.length > 0 && (
            <Fragment>
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button size="icon" variant="ghost">
                        <BreadcrumbEllipsis />
                      </Button>
                    }
                  />
                  <DropdownMenuContent className="w-fit">
                    <DropdownMenuGroup>
                      {collapsedBreadcrumbItems.map((item) => (
                        <DropdownMenuItem key={item.title}>
                          <Link href={item.url}>{item.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="mr-2" />
            </Fragment>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Desktop Breadcrumbs */}
      <Breadcrumb className="max-md:hidden">
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {isLast ? <BreadcrumbPage>{item.title}</BreadcrumbPage> : <BreadcrumbLink render={<Link href={item.url}>{item.title}</Link>} />}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
