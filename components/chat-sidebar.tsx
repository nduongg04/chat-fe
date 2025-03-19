"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Edit, LogOut, MessageCircle, Moon, Search, Settings, Sun, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { NewConversationDialog } from "@/components/new-conversation-dialog"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Sounds perfect! Looking forward to it 😊",
    timestamp: "10:40 AM",
    unread: 0,
    online: true,
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you send me those files?",
    timestamp: "Yesterday",
    unread: 3,
    online: true,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Great! I'll see you then.",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "How's the project coming along?",
    timestamp: "Monday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for your help!",
    timestamp: "Sunday",
    unread: 0,
    online: true,
  },
]

interface ChatSidebarProps {
  activeConversationId?: string
  activeTab?: string
}

export function ChatSidebar({ activeConversationId, activeTab = "chats" }: ChatSidebarProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Add event listener for the new conversation button in the welcome screen
  useEffect(() => {
    const handleNewConversation = () => {
      setShowNewConversationDialog(true)
    }

    window.addEventListener("new-conversation", handleNewConversation)

    return () => {
      window.removeEventListener("new-conversation", handleNewConversation)
    }
  }, [])

  return (
    <div className="flex h-full w-80 flex-col border-r">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold text-primary">Messenger</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">alex@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue={activeTab} className="w-full">
        <div className="border-b px-4 py-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats" asChild>
              <Link href="/chat" className="flex items-center justify-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chats
              </Link>
            </TabsTrigger>
            <TabsTrigger value="contacts" asChild>
              <Link href="/contacts" className="flex items-center justify-center">
                <Users className="mr-2 h-4 w-4" />
                Contacts
              </Link>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredConversations.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/chat/${conversation.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
                  activeConversationId === conversation.id && "bg-muted",
                )}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{conversation.name}</h3>
                    <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {conversation.unread}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <Button className="w-full" size="sm" onClick={() => setShowNewConversationDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>
      <NewConversationDialog
        open={showNewConversationDialog}
        onClose={() => setShowNewConversationDialog(false)}
        onCreateConversation={(contactIds, groupName) => {
          console.log("Creating conversation with:", contactIds, groupName)
          setShowNewConversationDialog(false)
        }}
      />
    </div>
  )
}

