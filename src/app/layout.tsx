import "./globals.css";

import { cn } from "cn";
import { Toaster } from "@/components/ui/toast";
import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { TanstackQueryProvider } from "@/components/providers/tanstack-query";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Capstone Project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans", spaceGrotesk.variable)}>
      <body className="w-full h-full">
        <Toaster />
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </body>
    </html>
  );
}
