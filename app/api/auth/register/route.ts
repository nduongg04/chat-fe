import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		// Get form data
		const formData = await req.formData();

		// Get API URL
		const API_URL = process.env.NEXT_PUBLIC_API_URL;

		// Forward the form data directly to the API
		const response = await fetch(`${API_URL}/auth/register`, {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ message: data.message || "Registration failed" },
				{ status: response.status }
			);
		}

		return NextResponse.json({ status: "success", data }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	}
}
