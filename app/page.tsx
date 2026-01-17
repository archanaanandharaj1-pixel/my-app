import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignOutButton from "@/components/sign-out-button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 p-8">
      <main className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome, {session.user.name}
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          You have successfully authenticated.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">My Profile</h3>
            <p className="text-sm text-gray-500 mb-4">{session.user.email}</p>
            <div className="text-xs bg-gray-100 p-2 rounded text-left overflow-auto">
              Role: {session.user.role || 'user'}
            </div>
          </div>

          <div className="p-6 border rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-sm text-gray-500">Manage users and settings (Admin only).</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="w-full mt-4">Go to Admin</Button>
            </Link>
          </div>
        </div>

        <div className="pt-8">
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}