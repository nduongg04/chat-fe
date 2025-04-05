'use server'
import { UsersResponse } from "@/types/user";
import { auth } from "@/auth";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const fetchUsers = async (token: string): Promise<UsersResponse> => {
    let accessToken = token;
    if(!token) {
        const session = await auth();
        accessToken = session?.user.accessToken || "";
    }
    try {
        const response = await fetch(`${API_URL}/users/except-current`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data: UsersResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}; 