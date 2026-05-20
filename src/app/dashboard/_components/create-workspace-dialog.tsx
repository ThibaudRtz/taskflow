"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Workspace</Button>
      <CreateWorkspaceModal isOpen={open} setIsOpen={setOpen} />
    </>
  );
}
