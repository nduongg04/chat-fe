import { auth } from "@/auth";

// Protect all routes under /api except /api/auth
export default auth((req) => {
	const isApiRoute = req.nextUrl.pathname.startsWith("/api");
	const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

	if (isApiRoute && !isAuthRoute && !req.auth) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
});

// Optionally, configure which routes to protect
export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
