"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { toastError } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Github, Mail, Upload } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Update schema to match AUTH.md requirements
const signupSchema = z
	.object({
		username: z
			.string()
			.min(3)
			.max(20, "Username must be between 3-20 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
		avatar: z.instanceof(File).optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<SignupForm>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Update form value
			form.setValue("avatar", file);

			// Create preview
			const reader = new FileReader();
			reader.onload = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const onSubmit = async (data: SignupForm) => {
		try {
			setLoading(true);

			// Create FormData for multipart/form-data request
			const formData = new FormData();
			formData.append("username", data.username);
			formData.append("email", data.email);
			formData.append("password", data.password);
			if (data.avatar) {
				formData.append("avatar", data.avatar);
			}

			// First register the user
			const res = await fetch("/api/auth/register", {
				method: "POST",
				body: formData,
			});

			const result = await res.json();

			if (!res.ok) {
				toastError(result.message || "Something went wrong");
				return;
			}

			// Then sign them in
			const signInResult = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (signInResult?.error) {
				toastError("Failed to sign in");
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
						<CardTitle className="text-2xl">
							Create an account
						</CardTitle>
					</div>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="johndoe123"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="space-y-2">
								<FormLabel>
									Profile Picture (Optional)
								</FormLabel>
								<div className="flex items-center gap-4">
									<Avatar className="h-16 w-16">
										<AvatarImage
											src={
												avatarPreview ||
												"/placeholder.svg?height=64&width=64"
											}
											alt="Avatar preview"
										/>
										<AvatarFallback>?</AvatarFallback>
									</Avatar>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											fileInputRef.current?.click()
										}
									>
										<Upload className="mr-2 h-4 w-4" />
										Upload Image
									</Button>
									<input
										ref={fileInputRef}
										type="file"
										onChange={handleFileChange}
										accept="image/jpeg,image/png,image/gif,image/jpg"
										className="hidden"
									/>
								</div>
							</div>

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
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
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
								{loading
									? "Creating account..."
									: "Create account"}
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
						Already have an account?{" "}
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
