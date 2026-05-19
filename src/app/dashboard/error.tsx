"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const details = process.env.NODE_ENV === "development" ? _error.message : null;

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-xl font-semibold">Dashboard failed to load</h2>
      <p className="text-sm text-muted-foreground">Please retry, then check your environment and database connection.</p>
      {details ? <p className="text-xs text-muted-foreground">{details}</p> : null}
      <Button onClick={reset}>Reload dashboard</Button>
    </div>
  );
}
