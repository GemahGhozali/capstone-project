"use client";

import Image from "next/image";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { IconPhoto } from "@tabler/icons-react";
import { createContext, useContext, useRef, useMemo, useEffect } from "react";

interface AvatarUploaderContextType {
  value: File | string | null;
  previewUrl: string | null;
  disabled?: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  openFilePicker: () => void;
  handleRemove: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  accept?: string;
}

const AvatarUploaderContext = createContext<AvatarUploaderContextType | undefined>(undefined);

export function useAvatarUploader() {
  const context = useContext(AvatarUploaderContext);
  if (!context) {
    throw new Error("Sub-komponen AvatarUploader harus berada di dalam AvatarUploaderRoot");
  }
  return context;
}

interface AvatarUploaderRootProps {
  value: File | string | null;
  onChange: (value: File | null) => void;
  onBlur: () => void;
  disabled?: boolean;
  accept?: string;
  render: () => React.ReactNode;
}

export function AvatarUploader({
  value,
  onChange,
  onBlur,
  disabled,
  accept = "image/jpg,image/jpeg,image/png,image/webp",
  render,
}: AvatarUploaderRootProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = useMemo(() => {
    if (typeof value === "string") return value;

    if (value instanceof File) return URL.createObjectURL(value);

    return null;
  }, [value]);

  useEffect(() => {
    return () => {
      if (value instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value, previewUrl]);

  const openFilePicker = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onBlur();
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    onBlur();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <AvatarUploaderContext.Provider
      value={{
        value,
        previewUrl,
        disabled,
        fileInputRef,
        openFilePicker,
        handleRemove,
        handleFileChange,
        onBlur,
        accept,
      }}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} onBlur={onBlur} accept={accept} className="hidden" disabled={disabled} />
      {render()}
    </AvatarUploaderContext.Provider>
  );
}

export function AvatarUploaderPreview({ className }: { className?: string }) {
  const { previewUrl } = useAvatarUploader();

  return (
    <div className={cn("relative overflow-hidden size-[90px] rounded-lg border border-input", className)}>
      {previewUrl ? (
        <Image src={previewUrl} alt="Avatar Preview" fill className="object-cover" />
      ) : (
        <div className="size-full bg-input/30 grid place-content-center text-muted-foreground">
          <IconPhoto size={32} />
        </div>
      )}
    </div>
  );
}

interface AvatarUploaderTriggerProps extends React.ComponentProps<typeof Button> {}

export function AvatarUploaderTrigger({ children, type = "button", ...props }: AvatarUploaderTriggerProps) {
  const { openFilePicker, disabled } = useAvatarUploader();

  return (
    <Button type={type} onClick={openFilePicker} disabled={disabled} {...props}>
      {children}
    </Button>
  );
}

interface AvatarUploaderRemoverProps extends React.ComponentProps<typeof Button> {}

export function AvatarUploaderRemover({ children, onClick, type = "button", ...props }: AvatarUploaderRemoverProps) {
  const { handleRemove, value, disabled } = useAvatarUploader();

  if (!value) return null;

  return (
    <Button type={type} onClick={handleRemove} disabled={disabled} {...props}>
      {children}
    </Button>
  );
}
