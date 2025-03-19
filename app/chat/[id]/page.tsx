import { ChatInterface } from "@/components/chat-interface"
import { ChatSidebar } from "@/components/chat-sidebar"

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
      status: "read",
    },
    {
      id: "msg2",
      sender: "currentUser",
      content: "Pretty good! Just finished a big project at work.",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: "msg3",
      sender: "user1",
      content: "That's awesome! We should celebrate sometime this week.",
      timestamp: "10:33 AM",
      status: "read",
    },
    {
      id: "msg4",
      sender: "currentUser",
      content: "Definitely! How about Friday evening?",
      timestamp: "10:35 AM",
      status: "sent",
    },
    {
      id: "msg5",
      sender: "user1",
      content: "Friday works for me. Where should we meet?",
      timestamp: "10:36 AM",
      status: "read",
    },
    {
      id: "msg6",
      sender: "currentUser",
      content: "How about that new restaurant downtown? I heard they have amazing food!",
      timestamp: "10:38 AM",
      status: "delivered",
    },
    {
      id: "msg7",
      sender: "user1",
      content: "Sounds perfect! Looking forward to it 😊",
      timestamp: "10:40 AM",
      status: "read",
    },
  ],
}

export default function ChatConversationPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar activeConversationId={params.id} />
      <ChatInterface conversation={mockConversation} />
    </div>
  )
}

