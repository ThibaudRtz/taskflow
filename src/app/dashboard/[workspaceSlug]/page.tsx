import { getWorkspaceBySlug } from "@/features/workspaces/queries/get-workspaces";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const workspace = await getWorkspaceBySlug(workspaceSlug);

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {workspace?.name}
          </h2>
          <p className="border-b pb-4 text-sm text-muted-foreground">
            Manage your workspace boards and settings
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          Boards functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}
