export interface WorkspaceSummary {
  id: string;
  name: string;
  boardsCount: number;
}

export async function listWorkspaceSummaries(): Promise<WorkspaceSummary[]> {
  return [];
}
