import { buttonVariants } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { cn } from "cn";

interface DataExportButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function DataExportButton({ href, label = "Export Excel", className }: DataExportButtonProps) {
  return (
    <a href={href} className={cn(buttonVariants({ variant: "outline" }), className)}>
      <IconDownload data-icon="inline-start" />
      <span>{label}</span>
    </a>
  );
}
