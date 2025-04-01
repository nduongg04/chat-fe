"use client";

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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Add this constant at the top of the file
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; // adjust port as needed
const CODE_EXPIRY_TIME = 10 * 60; // 10 minutes in seconds

// Form validation schemas
const emailSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

const codeSchema = z.object({
	code: z
		.string()
		.length(6, "Code must be 6 digits")
		.regex(/^\d+$/, "Code must contain only numbers"),
});

const passwordSchema = z
	.object({
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type Step = "email" | "code" | "password";

export default function ResetPasswordPage() {
	const router = useRouter();
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [timeLeft, setTimeLeft] = useState(0);

	// Countdown timer effect
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (timeLeft > 0) {
			timer = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0 && step === "code") {
			toast.error("Reset code has expired. Please request a new one.");
			setStep("email");
			setCode("");
		}
		return () => clearInterval(timer);
	}, [timeLeft, step]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleRequestReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const validatedData = emailSchema.parse({ email });
			const response = await fetch(
				`${API_URL}/auth/request-password-reset`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(validatedData),
				}
			);

			const data = await response.json();
			console.log(data);
			if (response.ok) {
				toast.success(data.message);
				setStep("code");
				setTimeLeft(CODE_EXPIRY_TIME); // Start countdown
			} else {
				toast.error(data.message || "Something went wrong");
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.errors[0].message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const validatedData = codeSchema.parse({ code });
			const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, code: validatedData.code }),
			});

			const data = await response.json();

			if (response.ok && data.data.isValid) {
				toast.success("Code verified successfully");
				setStep("password");
			} else {
				toast.error(data.message || "Invalid code");
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.errors[0].message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const validatedData = passwordSchema.parse({
				password,
				confirmPassword,
			});
			const response = await fetch(`${API_URL}/auth/reset-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					code,
					newPassword: validatedData.password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success(data.message);
				router.push("/login");
			} else {
				toast.error(data.message || "Something went wrong");
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error(error.errors[0].message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-gray-900 dark:to-gray-950">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="mr-2"
						>
							<Link href="/login">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<CardTitle className="text-2xl">
							Reset password
						</CardTitle>
					</div>
					<CardDescription>
						{step === "email" &&
							"Enter your email address and we'll send you a reset code"}
						{step === "code" && (
							<div className="space-y-1">
								<p>Enter the 6-digit code sent to your email</p>
								<p className="text-sm text-muted-foreground">
									Code expires in:{" "}
									<span
										className={`font-mono ${
											timeLeft < 60
												? "text-red-500"
												: "text-blue-600"
										}`}
									>
										{formatTime(timeLeft)}
									</span>
								</p>
							</div>
						)}
						{step === "password" && "Enter your new password"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{step === "email" && (
						<form
							onSubmit={handleRequestReset}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<Button
								className="w-full"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? "Sending..." : "Send reset code"}
							</Button>
						</form>
					)}

					{step === "code" && (
						<form onSubmit={handleVerifyCode} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="code">Reset Code</Label>
								<Input
									id="code"
									type="text"
									placeholder="Enter 6-digit code"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									maxLength={6}
									required
									disabled={timeLeft === 0}
								/>
							</div>
							<div className="flex gap-2">
								<Button
									className="flex-1"
									type="submit"
									disabled={isLoading || timeLeft === 0}
								>
									{isLoading ? "Verifying..." : "Verify code"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setStep("email");
										setCode("");
										setTimeLeft(0);
									}}
								>
									Resend
								</Button>
							</div>
						</form>
					)}

					{step === "password" && (
						<form
							onSubmit={handleResetPassword}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter new password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">
									Confirm Password
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									required
								/>
							</div>
							<Button
								className="w-full"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? "Resetting..." : "Reset password"}
							</Button>
						</form>
					)}
				</CardContent>
				<CardFooter>
					<div className="text-sm text-muted-foreground">
						Remember your password?{" "}
						<Link
							href="/login"
							className="text-primary hover:underline"
						>
							Sign in
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
