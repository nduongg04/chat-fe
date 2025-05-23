import { ChatSidebar } from "@/components/chat-sidebar"

export default function ContactsPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar activeTab="contacts" />
    </div>
  )
}

