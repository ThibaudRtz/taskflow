import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  "Collaborative workspaces",
  "Kanban boards with future drag & drop",
  "Realtime-ready architecture",
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 lg:px-10">
      <header className="flex items-center justify-between">
        <div className="text-lg font-semibold">TaskFlow</div>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </header>

      <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Build. Prioritize. Deliver.
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            A focused Kanban SaaS foundation for high-performing teams.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground lg:text-lg">
            TaskFlow is engineered for scale with App Router, Prisma, Auth.js, and a modern component system so your product can grow from MVP to enterprise.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/sign-in">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View dashboard shell</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Production-ready by default</CardTitle>
            <CardDescription>Architecture prepared for drag & drop, realtime updates, optimistic UI, notifications, and team collaboration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
