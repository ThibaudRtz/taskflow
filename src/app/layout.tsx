import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://taskflow.app"),
  title: {
    default: "TaskFlow",
    template: "%s · TaskFlow",
  },
  description:
    "TaskFlow is a collaborative Kanban workspace for modern product teams.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
