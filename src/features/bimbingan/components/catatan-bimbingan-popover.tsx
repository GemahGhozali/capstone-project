import { Button } from "@/components/ui/button";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

interface CatatanBimbinganPopoverProps {
  catatan: string;
}

export function CatatanBimbinganPopover({ catatan }: CatatanBimbinganPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="link" size="sm" className="h-auto p-0 text-sidebar-primary hover:no-underline">
            Lihat Selengkapnya
            <IconArrowUpRight />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-120 max-w-[calc(100vw-4.5rem)]">
        <PopoverHeader>
          <PopoverTitle>Catatan Bimbingan</PopoverTitle>
          <PopoverDescription>{catatan}</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
