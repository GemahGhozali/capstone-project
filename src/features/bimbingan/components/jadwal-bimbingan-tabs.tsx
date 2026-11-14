"use client";

import { useState } from "react";
import { JadwalBimbinganDosen } from "../types";
import { JadwalBimbinganTable } from "./jadwal-bimbingan-table";
import { ManageJadwalBimbinganPanel } from "./manage-jadwal-bimbingan-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JadwalBimbinganTabsProps {
  jadwalList: JadwalBimbinganDosen[];
}

type TabContent = "riwayat" | "kelola";

export function JadwalBimbinganTabs({ jadwalList }: JadwalBimbinganTabsProps) {
  const [activeTab, setActiveTab] = useState<TabContent>("riwayat");

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">{activeTab === "riwayat" ? "Riwayat Jadwal Bimbingan" : "Kelola Jadwal Bimbingan"}</h1>
        <p className="text-muted-foreground text-sm">
          {activeTab === "riwayat" ? "Semua daftar jadwal bimbingan yang telah anda buat." : "Tentukan tanggal dan waktu jadwal bimbingan"}
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-6">
        <TabsList className="w-full">
          <TabsTrigger value="riwayat" className="gap-1">
            Riwayat <span className="hidden md:inline">Jadwal Bimbingan</span>
          </TabsTrigger>
          <TabsTrigger value="kelola" className="gap-1">
            Kelola <span className="hidden md:inline">Jadwal Bimbingan</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="riwayat">
          <JadwalBimbinganTable jadwalList={jadwalList} />
        </TabsContent>
        <TabsContent value="kelola">
          <ManageJadwalBimbinganPanel jadwalList={jadwalList} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
