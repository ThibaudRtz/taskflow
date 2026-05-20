import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/features/workspaces/queries/get-workspaces";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const workspace = await getWorkspaceBySlug(workspaceSlug);

  if (!workspace) {
    notFound();
  }

  return <>{children}</>;
}
