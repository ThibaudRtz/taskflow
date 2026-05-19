import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const continueWithGoogle = async () => {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome to TaskFlow</CardTitle>
          <CardDescription>Sign in with Google to start managing your team workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={continueWithGoogle}>
            <Button type="submit" className="w-full">
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
