import { SettingsPanel } from "@/components/settings-panel"
import { ChatSidebar } from "@/components/chat-sidebar"

export default function SettingsPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSidebar activeTab="settings" />
      <SettingsPanel />
    </div>
  )
}

