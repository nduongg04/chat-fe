import { ChatResponse } from "@/types/chat";
import { UsersResponse } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const fetchUsers = async (token: string): Promise<UsersResponse> => {
  try {
    const response = await fetch(`${API_URL}/users/except-current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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