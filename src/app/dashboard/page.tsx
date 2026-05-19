import { CreateWorkspaceForm } from "@/components/forms/create-workspace-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <CardDescription>Create your first shared workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Boards</CardTitle>
          <CardDescription>Board setup is ready for future kanban workflows.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Task entities and ordering schema are prepared for drag and drop.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
