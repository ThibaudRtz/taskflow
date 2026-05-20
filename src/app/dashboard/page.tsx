import { redirect } from "next/navigation";
import { getUserWorkspaces } from "@/features/workspaces/queries/get-workspaces";
import { CreateWorkspaceDialog } from "./_components/create-workspace-dialog";

export default async function DashboardPage() {
  const workspaces = await getUserWorkspaces();

  if (workspaces.length > 0) {
    redirect(`/dashboard/${workspaces[0].slug}`);
  }

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center sm:p-20">
      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        No Workspaces Found
      </h2>
      <p className="mb-6 text-muted-foreground">
        Create your first workspace to start organizing your boards and tasks.
      </p>
      <CreateWorkspaceDialog />
    </div>
  );
}
