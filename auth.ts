import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					const res = await fetch(`${API_URL}/auth/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: credentials?.email,
							password: credentials?.password,
						}),
					});

					const data = await res.json();

					if (data.status === "success") {
						return {
							id: data.data.user.id,
							username: data.data.user.username,
							email: data.data.user.email,
							avatar: data.data.user.avatar,
							accessToken: data.data.accessToken,
							refreshToken: data.data.refreshToken,
						};
					}

					return null;
				} catch (error) {
					console.error(error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
				token.id = user.id!;
				token.username = user.username!;
				token.email = user.email!;
				token.avatar = user.avatar!;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.username = token.username;
				session.user.email = token.email;
				session.user.avatar = token.avatar;
				session.user.accessToken = token.accessToken;
				session.user.refreshToken = token.refreshToken;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
});

// Extend next-auth session type to include accessToken
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			image?: string;
			accessToken: string;
		};
	}
	interface User {
		accessToken: string;
	}
}
