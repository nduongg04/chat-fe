"use client"

import { ChatSidebar } from "@/components/chat-sidebar"
import { useSession } from "next-auth/react";
import React from "react"
export default function ChatPage() {
  const {data: session} = useSession();
  const accessToken = session?.user.accessToken;
  const userId = session?.user.id;
  console.log(accessToken, userId)
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar accessToken={accessToken} userId={userId} />
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 dark:bg-muted/10">
        <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
          <div className="rounded-full bg-primary/10 p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-primary"
            >
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Welcome to Messenger</h1>
          <p className="text-muted-foreground">Select a conversation from the sidebar or start a new one</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.dispatchEvent(new CustomEvent("new-conversation"))}
          >
            Start a new conversation
          </Button>
        </div>
      </div>
    </div>
  )
}




export function Button({ 
  children, 
  variant = "default", 
  className = "",   
  onClick 
}: { 
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  )
}