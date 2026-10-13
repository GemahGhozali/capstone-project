import "./globals.css";

import { cn } from "cn";
import { Toaster } from "@/components/ui/toast";
import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TanstackQueryProvider } from "@/components/providers/tanstack-query";
import { ThemeProvider } from "@/components/providers/theme";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Capstone Project",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "font-sans", spaceGrotesk.variable)}>
      <body className="w-full h-full">
        <ThemeProvider>
          <Toaster />
          <TanstackQueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
