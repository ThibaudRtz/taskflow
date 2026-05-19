import { redirect } from "next/navigation";

import { auth, googleAuthEnabled, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome to TaskFlow</CardTitle>
          <CardDescription>
            Sign in with Google to start managing your team workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleAuthEnabled ? (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <Button type="submit" className="w-full">
                Continue with Google
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <Button type="button" className="w-full" disabled>
                Continue with Google
              </Button>
              <p className="text-sm text-muted-foreground">
                Configure <span className="font-medium">GOOGLE_CLIENT_ID</span>{" "}
                and <span className="font-medium">GOOGLE_CLIENT_SECRET</span> in{" "}
                <span className="font-medium">.env.local</span> to enable
                sign-in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
