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

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // OTP states
    const [isOtpLogin, setIsOtpLogin] = useState(false);
    const [otpStep, setOtpStep] = useState<"email" | "otp">("email");
    const [otp, setOtp] = useState("");

    const handleSignIn = async () => {
        setLoading(true);
        await authClient.signIn.email({
            email,
            password,
        }, {
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                alert(ctx.error.message);
                setLoading(false);
            }
        });
    };

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
            });
            setOtpStep("otp");
            setLoading(false);
        } catch (error: any) {
            alert(error.message || "Failed to send OTP");
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await authClient.signIn.emailOtp({
                email,
                otp
            }, {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (ctx) => {
                    alert(ctx.error.message);
                    setLoading(false);
                }
            });
        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{isOtpLogin ? (otpStep === "otp" ? "Enter OTP" : "Login with OTP") : "Sign In"}</CardTitle>
                    <CardDescription>
                        {isOtpLogin
                            ? (otpStep === "otp" ? "Enter the code sent to your email" : "Enter your email to receive a code")
                            : "Enter your email below to login to your account"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isOtpLogin && (
                        <>
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
                        </>
                    )}

                    {isOtpLogin && otpStep === "email" && (
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
                    )}

                    {isOtpLogin && otpStep === "otp" && (
                        <div className="space-y-2">
                            <Label htmlFor="otp">OTP Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    {!isOtpLogin && (
                        <>
                            <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                            <Button variant="outline" className="w-full" onClick={async () => {
                                await authClient.signIn.social({
                                    provider: "google",
                                    callbackURL: "/"
                                });
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                Sign in with Google
                            </Button>
                            <Button variant="outline" className="w-full" onClick={async () => {
                                await authClient.signIn.social({
                                    provider: "github",
                                    callbackURL: "/"
                                });
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                Sign in with GitHub
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => setIsOtpLogin(true)}>
                                Login with Code
                            </Button>
                        </>
                    )}

                    {isOtpLogin && otpStep === "email" && (
                        <>
                            <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                                {loading ? "Sending Code..." : "Send Code"}
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setIsOtpLogin(false)}>
                                Back to Password Login
                            </Button>
                        </>
                    )}

                    {isOtpLogin && otpStep === "otp" && (
                        <>
                            <Button className="w-full" onClick={handleVerifyOtp} disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Sign In"}
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setOtpStep("email")}>
                                Back
                            </Button>
                        </>
                    )}

                    <p className="text-sm text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/sign-up" className="text-blue-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
