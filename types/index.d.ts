import "next-auth/jwt";

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		refreshToken: string;
		id: string;
		username: string;
		email: string;
		avatar: string;
		bio: string;
		status: "online" | "offline";
		theme: "light" | "dark";
		lastSeen: Date;
	}
}

declare module "next-auth" {
	interface User {
		id: string;
		username: string;
		email: string;
		avatar: string;
		accessToken: string;
		refreshToken: string;
		bio: string;
		status: "online" | "offline";
		theme: "light" | "dark";
		lastSeen: Date;
	}
	interface Session {
		user: User;
	}

	// interface Account {
	// 	user: User;
	// }
}
