"use client";

import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import { KuesionerOverview } from "../types";
import { useChangeKuesionerStatus } from "../hooks";
import { IconCloudUpload, IconLock } from "@tabler/icons-react";

interface KuesionerStatusDialogContent {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  mediaClassName: string;
  actionVariant: "default" | "destructive";
  actionLabel: string;
}

const statusChangeContent: Record<"publish" | "close", KuesionerStatusDialogContent> = {
  publish: {
    title: "Konfirmasi Publish Kuesioner",
    description: (
      <>
        Kuesioner akan berstatus <span className="font-medium">Aktif</span> dan dapat diisi oleh mahasiswa. Kuesioner{" "}
        <span className="font-medium">tidak akan bisa diedit lagi</span>, apakah anda yakin?
      </>
    ),
    icon: <IconCloudUpload />,
    mediaClassName: "bg-sidebar-primary/15 text-sidebar-primary",
    actionVariant: "default",
    actionLabel: "Publish",
  },
  close: {
    title: "Konfirmasi Tutup Kuesioner",
    description: (
      <>
        Kuesioner akan <span className="font-medium">Ditutup</span> dan{" "}
        <span className="font-medium">tidak akan bisa dibuka kembali atau dihapus.</span> Apakah anda sudah yakin?
      </>
    ),
    icon: <IconLock />,
    mediaClassName: "bg-destructive/15 text-destructive",
    actionVariant: "destructive",
    actionLabel: "Tutup",
  },
};

interface ChangeStatusAlertDialogProps {
  statusChange?: { kuesioner: KuesionerOverview; mode: "publish" | "close" };
  closeDialog: () => void;
}

export function ChangeStatusAlertDialog({ statusChange, closeDialog }: ChangeStatusAlertDialogProps) {
  const { mutateAsync, isPending } = useChangeKuesionerStatus();

  const content = statusChange ? statusChangeContent[statusChange.mode] : undefined;

  const handleChangeStatus = async () => {
    if (!statusChange) return;

    try {
      const data = { id: statusChange.kuesioner.id, mode: statusChange.mode };
      await mutateAsync(data, { onError: closeDialog, onSuccess: closeDialog });
    } catch (error) {
      // Error dihandle otomatis oleh useMutation
    }
  };

  return (
    <AlertDialog
      open={statusChange !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <AlertDialogContent size="sm" className="max-w-sm!">
        <AlertDialogHeader>
          <AlertDialogMedia className={content?.mediaClassName}>{content?.icon}</AlertDialogMedia>
          <AlertDialogTitle>{content?.title}</AlertDialogTitle>
          <AlertDialogDescription>{content?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant={content?.actionVariant} onClick={handleChangeStatus} disabled={isPending}>
            {isPending ? "Memproses" : content?.actionLabel}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
