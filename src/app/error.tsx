"use client";

import { Button } from "@/components/ui/button";

export default function RootError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const details = process.env.NODE_ENV === "development" ? _error.message : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">An unexpected error occurred while rendering TaskFlow.</p>
      {details ? <p className="text-xs text-muted-foreground">{details}</p> : null}
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
