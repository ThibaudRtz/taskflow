"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { renameBoard } from "@/features/boards/actions/rename-board";
import { deleteBoard } from "@/features/boards/actions/delete-board";

interface BoardSettingsProps {
  boardId: string;
  boardTitle: string;
  workspaceSlug: string;
  workspaceId: string;
}

export function BoardSettings({
  boardId,
  boardTitle,
  workspaceSlug,
  workspaceId,
}: BoardSettingsProps) {
  const router = useRouter();

  // Dialog states
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [newTitle, setNewTitle] = useState(boardTitle);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTitle === boardTitle) {
      setShowRenameDialog(false);
      return;
    }

    setIsRenaming(true);
    try {
      const result = await renameBoard({
        id: boardId,
        title: newTitle.trim(),
        workspaceId,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Board renamed successfully");
      setShowRenameDialog(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to rename board");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBoard(boardId, workspaceId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Board deleted successfully");
      router.push(`/dashboard/${workspaceSlug}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete board");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>
            <Pencil className="mr-2 size-4" />
            Rename Board
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <Dialog
        open={showRenameDialog}
        onOpenChange={(open) => {
          setShowRenameDialog(open);
          if (!open) setNewTitle(boardTitle);
        }}
      >
        <DialogContent>
          <form onSubmit={handleRename}>
            <DialogHeader>
              <DialogTitle>Rename Board</DialogTitle>
              <DialogDescription>
                Enter a new name for this board.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Board Title</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sprint 2"
                  disabled={isRenaming}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRenameDialog(false)}
                disabled={isRenaming}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isRenaming || !newTitle.trim()}>
                {isRenaming ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              board
              <strong> &quot;{boardTitle}&quot;</strong> and remove all its
              columns and tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Board"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
