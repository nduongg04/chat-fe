import "next-auth/jwt";

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		refreshToken: string;
		id: string;
		username: string;
		email: string;
		avatar: string;
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
	}
}
