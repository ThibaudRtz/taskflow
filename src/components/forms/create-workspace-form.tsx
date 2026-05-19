"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorkspace } from "@/features/workspaces/actions/create-workspace";

const schema = z.object({
  name: z.string().min(2, "Workspace name is too short").max(80),
});

type FormValues = z.infer<typeof schema>;

export function CreateWorkspaceForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await createWorkspace(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1">
        <Input id="workspaceName" placeholder="Workspace name" {...register("name")} />
        {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Create workspace
      </Button>
    </form>
  );
}
