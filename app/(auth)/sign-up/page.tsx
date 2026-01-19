"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        setLoading(true);
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        }, {
            onRequest: () => {
                setLoading(true);
            },
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                alert(ctx.error.message);
                setLoading(false);
            },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your account to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full" onClick={handleSignUp} disabled={loading}>
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/"
                        });
                    }}>
                        Sign up with Google
                    </Button>
                    <Button variant="outline" className="w-full" onClick={async () => {
                        await authClient.signIn.social({
                            provider: "github",
                            callbackURL: "/"
                        });
                    }}>
                        Sign up with GitHub
                    </Button>
                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-blue-500 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
