"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    return (
        <Button
            variant="destructive"
            onClick={async () => {
                await authClient.signOut();
                router.push("/sign-in");
            }}
        >
            Sign Out
        </Button>
    )
}
