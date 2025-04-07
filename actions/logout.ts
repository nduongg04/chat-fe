"use server";

import { auth, signOut } from "@/auth";

export async function logout() {
	const session = await auth();
	console.log("session", session);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.user.accessToken}`,
			},
			body: JSON.stringify({
				deviceId: session?.user.deviceId,
			}),
		}
	);
	const data = await response.json();
	if (data.status === "success") {
		console.log("Logged out successfully");
		await signOut({redirectTo: "/"});
	} else {
		console.error("Failed to logout", data.message);
		throw new Error(data.message);
	}
}
