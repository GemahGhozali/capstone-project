"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { TeamMemberInput } from "../schemas";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCheck, IconMail, IconUsers, IconX } from "@tabler/icons-react";
import { useAcceptTeamInvitation, useRejectTeamInvitation } from "../hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TeamInvitationAlertProps {
  teamMembers: TeamMemberInput[];
  teamName: string;
}

export function TeamInvitationAlert({ teamMembers, teamName }: TeamInvitationAlertProps) {
  const { mutate: acceptTeamInvitation, isPending: acceptInviationPending } = useAcceptTeamInvitation();
  const { mutate: rejectTeamInvitation, isPending: rejectInviationPending } = useRejectTeamInvitation();

  const membersInTeam = teamMembers.filter((member) => !member.isCurrentLoginUser);
  const invitedMahasiswa = teamMembers.find((member) => member.isCurrentLoginUser);

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-col items-center gap-4 p-6 lg:flex-row">
        <div className="flex items-center flex-col gap-3 lg:flex-row">
          <div className="bg-blue-500/15 text-blue-500 size-12 grid place-content-center rounded-full shrink-0 ">
            <IconMail />
          </div>
          <div className="text-center lg:text-left">
            <CardTitle>Anda Mendapatkan Undangan Tim!</CardTitle>
            <CardDescription>Silahkan lihat detail undangannya.</CardDescription>
          </div>
        </div>

        <Dialog>
          <DialogTrigger render={<Button className="w-full lg:w-auto lg:ml-auto">Lihat Undangan</Button>} />
          <DialogContent className="sm:max-w-md p-0 gap-0">
            <DialogHeader className="p-6">
              <DialogTitle>Detail Undangan Tim</DialogTitle>
              <DialogDescription>{teamName}</DialogDescription>
            </DialogHeader>

            {/* Tabs Content */}
            <Tabs defaultValue="undangan" className="w-full p-6 py-0 gap-6">
              <TabsList className="w-full">
                <TabsTrigger value="undangan">
                  <IconMail /> Undangan
                </TabsTrigger>
                <TabsTrigger value="anggota">
                  <IconUsers /> Anggota
                </TabsTrigger>
              </TabsList>

              {/* Undangan Tabs Content */}
              <TabsContent value="undangan">
                {invitedMahasiswa && (
                  <Card className="p-0 gap-0">
                    <CardHeader className="flex items-center gap-3 p-4">
                      <Avatar key={invitedMahasiswa.id}>
                        <AvatarImage src={invitedMahasiswa.fotoProfil ?? ""} alt={invitedMahasiswa.namaLengkap} />
                        <AvatarFallback>{generateNameInitials(invitedMahasiswa.namaLengkap)}</AvatarFallback>
                      </Avatar>
                      <div className="space-">
                        <p className="line-clamp-1 text-sm font-medium">{invitedMahasiswa.namaLengkap}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">Anda - {invitedMahasiswa.nim}</p>
                      </div>
                      <Badge variant="secondary" className="h-6 ml-auto">
                        {invitedMahasiswa.kategoriCapstone}
                      </Badge>
                    </CardHeader>
                    <Separator />
                    <CardFooter className="p-4 text-muted-foreground">
                      <p>
                        Anda diundang untuk bergabung ke dalam <b>{teamName}</b> dengan Kategori Capstone{" "}
                        <b>{invitedMahasiswa.kategoriCapstone === "EPD" ? "Engineering Process Design (EPD)" : "Scientific Method (SM)"}</b>
                      </p>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>

              {/* Anggota Tabs Content */}
              <TabsContent value="anggota">
                <Card className="p-4 gap-4">
                  {membersInTeam.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar key={member.id}>
                        <AvatarImage src={member.fotoProfil ?? ""} alt={member.namaLengkap} />
                        <AvatarFallback>{generateNameInitials(member.namaLengkap)}</AvatarFallback>
                      </Avatar>
                      <div className="space">
                        <p className="line-clamp-1 text-sm font-medium">{member.namaLengkap}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {member.peran} - {member.nim}
                        </p>
                      </div>
                      <Badge variant="secondary" className="h-6 ml-auto">
                        {member.kategoriCapstone}
                      </Badge>
                    </div>
                  ))}
                </Card>
              </TabsContent>
            </Tabs>

            {/* CTA Buttons */}
            <DialogFooter className="p-6 gap-3 flex-col!">
              <Button variant="success" onClick={() => acceptTeamInvitation()} disabled={acceptInviationPending || rejectInviationPending}>
                {acceptInviationPending ? "Memproses" : "Terima Undangan"}
                {acceptInviationPending ? <Spinner data-icon="inline-end" /> : <IconCheck data-icon="inline-end" />}
              </Button>
              <Button variant="destructive" onClick={() => rejectTeamInvitation()} disabled={acceptInviationPending || rejectInviationPending}>
                {rejectInviationPending ? "Memproses" : "Tolak Undangan"}
                {rejectInviationPending ? <Spinner data-icon="inline-end" /> : <IconX data-icon="inline-end" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
}
