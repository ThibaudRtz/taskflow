"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { type Workspace } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateWorkspaceModal } from "./create-workspace-modal";

interface WorkspaceSwitcherProps {
  workspaces: Pick<Workspace, "id" | "name" | "slug">[];
}

export function WorkspaceSwitcher({ workspaces }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const params = useParams<{ workspaceSlug?: string }>();
  const router = useRouter();

  const activeWorkspace =
    workspaces.find((w) => w.slug === params?.workspaceSlug) || workspaces[0];

  const onWorkspaceSelect = (
    workspace: Pick<Workspace, "id" | "name" | "slug">,
  ) => {
    setOpen(false);
    router.push(`/dashboard/${workspace.slug}`);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            className="w-full justify-between px-2"
          >
            <div className="flex items-center gap-2 truncate">
              <Avatar className="size-5">
                <AvatarFallback className="text-xs">
                  {activeWorkspace?.name?.charAt(0).toUpperCase() || "W"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {activeWorkspace?.name || "Select workspace"}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              <CommandEmpty>No workspaces found.</CommandEmpty>
              <CommandGroup heading="Workspaces">
                {workspaces.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    onSelect={() => onWorkspaceSelect(workspace)}
                    className="text-sm cursor-pointer"
                  >
                    <Avatar className="mr-2 size-5">
                      <AvatarFallback>
                        {workspace.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {workspace.name}
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        activeWorkspace?.id === workspace.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowCreateModal(true);
                  }}
                  className="cursor-pointer text-sm"
                >
                  <Plus className="mr-2 size-4" />
                  Create Workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateWorkspaceModal
        isOpen={showCreateModal}
        setIsOpen={setShowCreateModal}
      />
    </>
  );
}
