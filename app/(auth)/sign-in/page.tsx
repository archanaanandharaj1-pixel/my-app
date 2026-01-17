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
                                Sign in with Google
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
