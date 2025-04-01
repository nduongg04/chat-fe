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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { loginSchema } from "@/lib/schemas";
import { toastError } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			setLoading(true);
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});
			console.log("result", result);

			if (result?.error) {
				toastError(
					"Invalid credentials",
					"Please check your email and password"
				);
				return;
			}

			router.push("/chat");
			router.refresh();
		} catch (error) {
			console.error(error);
			toastError("Something went wrong");
		} finally {
			setLoading(false);
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
							<Link href="/">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<CardTitle className="text-2xl">Sign in</CardTitle>
					</div>
					<CardDescription>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="name@example.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between">
											<FormLabel>Password</FormLabel>
											<Link
												href="/reset-password"
												className="text-xs text-primary hover:underline"
											>
												Forgot password?
											</Link>
										</div>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								className="w-full"
								type="submit"
								disabled={loading}
							>
								{loading ? "Signing in..." : "Sign in"}
							</Button>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-card px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<Button
									variant="outline"
									type="button"
									onClick={() => signIn("github")}
								>
									<Github className="mr-2 h-4 w-4" />
									Github
								</Button>
								<Button
									variant="outline"
									type="button"
									onClick={() => signIn("google")}
								>
									<Mail className="mr-2 h-4 w-4" />
									Google
								</Button>
							</div>
						</CardContent>
					</form>
				</Form>
				<CardFooter>
					<div className="text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-primary hover:underline"
						>
							Sign up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
