import { ChatResponse, CreateChatResponse } from "@/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const fetchChatRooms = async (token: string, userId: string): Promise<ChatResponse> => {
    try {
        const response = await fetch(`${API_URL}/chats/getChatByUserId/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        });

        if (!response.ok) {
        throw new Error(`Error fetching chat rooms: ${response.statusText}`);
        }

        const data: ChatResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
        throw error;
    }
}; 

export const createPrivateConversation = async (token: string, contactId: string, userId: string) => {
    try {
        const response = await fetch(`${API_URL}/chats/createChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                members: [contactId, userId]
            })
        });

        if (!response.ok) {
            throw new Error(`Error creating private conversation: ${response.statusText}`);
        }

        const data: CreateChatResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create private conversation:", error);
        throw error;
    }
}

export const createGroupConversation = async (token: string, groupName: string, userId: string, contactIds: string[]) => {
    try {
        const response = await fetch(`${API_URL}/chats/group`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                members: [...contactIds, userId],
                groupName: groupName
            })
        });

        if (!response.ok) {
            throw new Error(`Error creating group conversation: ${response.statusText}`);
        }

        const data: CreateChatResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create group conversation:", error);
        throw error;
    }
}

export const fetchConversationById = async (token: string, conversationId: string) => {
    try {
        const response = await fetch(`${API_URL}/chats/${conversationId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching conversation: ${response.statusText}`);
        }

        const data: CreateChatResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch conversation:", error);
        throw error;
    }
}

export const deleteConversation = async (token: string, conversationId: string) => {
    try {
        const response = await fetch(`${API_URL}/chats/${conversationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error deleting conversation: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error("Failed to delete conversation:", error);
        throw error;
    }
}