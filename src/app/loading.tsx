import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
      <div className="grid w-full gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
