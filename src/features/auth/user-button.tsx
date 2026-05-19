import type { Session } from "next-auth";

import { signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserButton({ session }: { session: Session | null }) {
  if (!session?.user) {
    return null;
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
      className="flex items-center gap-2"
    >
      <Avatar>
        <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User avatar"} />
        <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase() ?? "TF"}</AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="sm" type="submit">
        Sign out
      </Button>
    </form>
  );
}
