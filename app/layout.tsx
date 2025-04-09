import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { NotiCall } from "@/components/notiCall";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Messenger - Modern Chat Platform",
	description: "A modern messaging platform UI",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<SessionProvider>
					<ThemeProvider>{children}</ThemeProvider>
					<Toaster />
					<NotiCall />
				</SessionProvider>
			</body>
		</html>
	);
}
