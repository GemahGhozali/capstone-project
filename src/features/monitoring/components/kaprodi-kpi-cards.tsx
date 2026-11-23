import Link from "next/link";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { KaprodiDashboard } from "../types";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconArrowUpRight, IconClipboardText, IconFileDescription, IconSchool, IconUsers } from "@tabler/icons-react";

interface KaprodiKPICardsProps {
  data: KaprodiDashboard;
}

export function KaprodiKPICards({ data }: KaprodiKPICardsProps) {
  const cardIconBaseClass = "grid size-12 shrink-0 place-content-center rounded-full mb-3";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-blue-500/15 text-blue-500")}>
              <IconSchool />
            </div>
            <CardTitle className="text-lg font-semibold">{data.totalMahasiswa} Total</CardTitle>
            <CardDescription>Keseluruhan Mahasiswa Aktif</CardDescription>
            <CardAction>
              <Link href="/kaprodi/daftar-mahasiswa">
                <Button size="icon-sm" variant="outline">
                  <IconArrowUpRight />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-purple-500/15 text-purple-500")}>
              <IconSchool />
            </div>
            <CardTitle className="text-lg font-semibold">{data.totalDosenAktif} Total</CardTitle>
            <CardDescription>Keseluruhan Dosen Aktif</CardDescription>
            <CardAction>
              <Link href="/kaprodi/daftar-dosen">
                <Button size="icon-sm" variant="outline">
                  <IconArrowUpRight />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-green-500/15 text-green-500")}>
              <IconUsers />
            </div>
            <CardTitle className="text-lg font-semibold">{data.totalTimAktif} Total</CardTitle>
            <CardDescription>Tim Capstone Project Aktif</CardDescription>
            <CardAction>
              <Link href="/kaprodi/daftar-tim">
                <Button size="icon-sm" variant="outline">
                  <IconArrowUpRight />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-yellow-500/15 text-yellow-500")}>
              <IconClipboardText />
            </div>
            <CardTitle className="text-lg font-semibold">{data.totalProposal} Total</CardTitle>
            <CardDescription>Keseluruhan Proposal Masuk</CardDescription>
            <CardAction>
              <Link href="/kaprodi/daftar-proposal">
                <Button size="icon-sm" variant="outline">
                  <IconArrowUpRight />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-red-500/15 text-red-500")}>
              <IconFileDescription />
            </div>
            <CardTitle className="text-lg font-semibold">{data.totalResume} Total</CardTitle>
            <CardDescription>Keseluruhan Resume Masuk</CardDescription>
            <CardAction>
              <Link href="/kaprodi/daftar-resume">
                <Button size="icon-sm" variant="outline">
                  <IconArrowUpRight />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
