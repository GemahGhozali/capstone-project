"use client";

import React from "react";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/format-file-size";
import { IconUpload, IconX, IconFileDescription } from "@tabler/icons-react";

interface FileUploaderProps {
  label: string;
  description: string;
  value: File | string | null;
  onChange: (value: File | null) => void;
  onBlur: () => void;
  disabled?: boolean;
  accept?: string;
  invalid?: boolean;
}

export function FileUploader({
  label,
  description,
  value,
  onChange,
  onBlur,
  disabled = false,
  accept = "application/pdf",
  invalid,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const fileName = React.useMemo(() => {
    if (value instanceof File) {
      return value.name;
    }

    if (typeof value === "string") {
      return value.split("/").pop();
    }

    return null;
  }, [value]);

  const fileSize = React.useMemo(() => {
    if (value instanceof File) {
      return formatFileSize(value.size);
    }

    return null;
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) onChange(file);
    onBlur();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    onBlur();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;

    if (file) {
      onChange(file);
      onBlur();
    }
  };

  const openFilePicker = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      aria-invalid={invalid}
      onClick={openFilePicker}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center px-6 py-8 border border-input border-dashed rounded-lg transition-colors duration-300 text-center cursor-pointer select-none",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        isDragging && "border-sidebar-primary bg-sidebar-primary/10",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
      )}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} onBlur={onBlur} accept={accept} className="hidden" disabled={disabled} />
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "size-10 grid place-content-center text-muted-foreground",
            value ? "bg-secondary rounded-md" : "rounded-full border border-input border-dashed",
          )}
        >
          {value ? <IconFileDescription className="size-5" /> : <IconUpload className="size-4" />}
        </div>
        <div className="space-y-0.5">
          <p className="font-semibold text-base text-foreground line-clamp-1">{value ? fileName : isDragging ? "Drop File Disini" : label}</p>
          <p className="text-sm text-muted-foreground">{value ? fileSize : description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={openFilePicker} disabled={disabled} className="text-foreground!">
          {value ? "Ganti File" : "Upload File"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute -top-3 -right-3 rounded-full border-4 border-background"
          >
            <IconX className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
