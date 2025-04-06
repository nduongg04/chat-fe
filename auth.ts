import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

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
							bio: data.data.user.bio,
							status: data.data.user.status,
							theme: data.data.user.theme,
							lastSeen: data.data.user.lastSeen,
						};
					}

					return null;
				} catch (error) {
					console.error(error);
					return null;
				}
			},
		}),
		Google,
	],
	callbacks: {
		async signIn({ account, profile, user }) {
			if (account?.provider === "google") {
				try {
					const res = await fetch(`${API_URL}/auth/google`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ profile }),
					});
					const data = await res.json();
					user.accessToken = data.data.accessToken;
					user.refreshToken = data.data.refreshToken;
					user.id = data.data.user.id;
					user.username = data.data.user.username;
					user.email = data.data.user.email;
					user.avatar = data.data.user.avatar;
					user.bio = data.data.user.bio;
					user.status = data.data.user.status;
					user.theme = data.data.user.theme;
					user.lastSeen = data.data.user.lastSeen;
					// Return true to allow the sign-in to proceed
					return data.status === "success";
				} catch (error) {
					console.error("Google auth error:", error);
					return false;
				}
			}
			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
				token.id = user.id!;
				token.username = user.username!;
				token.email = user.email!;
				token.avatar = user.avatar!;
				token.bio = user.bio!;
				token.status = user.status!;
				token.theme = user.theme!;
				token.lastSeen = user.lastSeen!;
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
				session.user.bio = token.bio;
				session.user.status = token.status;
				session.user.theme = token.theme;
				session.user.lastSeen = token.lastSeen;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
});
