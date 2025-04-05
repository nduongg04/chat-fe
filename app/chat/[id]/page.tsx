import { auth } from "@/auth";
import { ChatInterface } from "@/components/chat-interface"
import { ChatSidebar } from "@/components/chat-sidebar"
import { fetchConversationById } from "@/services/chatService";

// Mock data for a conversation
const mockConversation = {
  id: "1",
  user: {
    id: "user1",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  messages: [
    {
      id: "msg1",
      sender: "user1",
      content: "Hey there! How's your day going?",
      timestamp: "10:30 AM",
      status: "read" as const,
    },
    {
      id: "msg2",
      sender: "currentUser",
      content: "Pretty good! Just finished a big project at work.",
      timestamp: "10:32 AM",
      status: "read" as const,
    },
    {
      id: "msg3",
      sender: "user1",
      content: "That's awesome! We should celebrate sometime this week.",
      timestamp: "10:33 AM",
      status: "read" as const,
    },
    {
      id: "msg4",
      sender: "currentUser",
      content: "Definitely! How about Friday evening?",
      timestamp: "10:35 AM",
      status: "sent" as const,
    },
    {
      id: "msg5",
      sender: "user1",
      content: "Friday works for me. Where should we meet?",
      timestamp: "10:36 AM",
      status: "read" as const,
    },
    {
      id: "msg6",
      sender: "currentUser",
      content: "How about that new restaurant downtown? I heard they have amazing food!",
      timestamp: "10:38 AM",
      status: "delivered" as const,
    },
    {
      id: "msg7",
      sender: "user1",
      content: "Sounds perfect! Looking forward to it 😊",
      timestamp: "10:40 AM",
      status: "read" as const,
    },
  ],
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatConversationPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const chatRoom = await fetchConversationById(session?.user.accessToken || "", id)
  const conversation = chatRoom.data
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar activeConversationId={id} accessToken={session?.user.accessToken} userId={session?.user.id} />
      <ChatInterface conversation={conversation} isOnline={true} />
    </div>
  )
}

