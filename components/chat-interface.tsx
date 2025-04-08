"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AtSign, Image, Info, Mic, Paperclip, Phone, Send, Smile, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Add these imports at the top
import { ProfileModal } from "@/components/profile-modal"
// import { CallScreen } from "@/components/call-screen"
import { BlockUserAlert } from "@/components/block-user-alert"
import { SearchConversation } from "@/components/search-conversation"
import { ConversationInfo } from "@/components/conversation-info"
import { EmojiPicker } from "@/components/emoji-picker"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
}

interface User {
  id: string
  name: string
  avatar: string
  status: string
}

interface Conversation {
  id: string
  user: User
  messages: Message[]
}

interface ChatInterfaceProps {
  conversation: Conversation
}

export function ChatInterface({ conversation }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showConversationInfo, setShowConversationInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  // const [inCall, setInCall] = useState<false | "audio" | "video">(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)

  // Add these state variables inside the component
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showBlockUserAlert, setShowBlockUserAlert] = useState(false)
  // const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)

  // Simulate typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(Math.random() > 0.7)
    }, 3000)

    return () => clearTimeout(typingTimeout)
  }, [conversation.messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages, isTyping, forceUpdate])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    // Create an optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: "currentUser",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending" as "sending" | "sent" | "delivered" | "read",
    }

    // In a real app, this would send the message to the backend
    console.log("Sending message:", newMessage)

    // Clear input and add optimistic message
    setNewMessage("")

    // Simulate message being sent and delivered
    setTimeout(() => {
      optimisticMessage.status = "sent"
      // Force re-render
      setForceUpdate((prev) => !prev)
    }, 500)

    setTimeout(() => {
      optimisticMessage.status = "delivered"
      // Force re-render
      setForceUpdate((prev) => !prev)
    }, 1500)
  }

  // Add this function to handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Add this function to handle message navigation
  const handleNavigateToMessage = (messageId: string) => {
    // In a real app, this would scroll to the message
    console.log("Navigating to message:", messageId)
  }
  const openCall = (callType: "audio" | "video", id: string) => {
    console.log("Opening call:", callType, id)
    const url = `/call/${id}?type=${callType}`
    window.open(url, "_blank", "width=800,height=600")
  }
  return (
    <div className="flex h-full flex-1">
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {conversation.user.status === "online" && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
              )}
            </div>
            <div>
              <h2 className="font-medium">{conversation.user.name}</h2>
              <p className="text-xs text-muted-foreground">
                {conversation.user.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openCall("video", 'user2')}>
                    <Phone className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice call</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => openCall("video", conversation.user.id)}>
                    <Video className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Video call</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowConversationInfo(!showConversationInfo)}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Conversation info</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.sender === "currentUser" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2",
                    message.sender === "currentUser" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p>{message.content}</p>
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-xs",
                      message.sender === "currentUser" ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    <span>{message.timestamp}</span>
                    {message.sender === "currentUser" && (
                      <span>
                        {message.status === "read" && "✓✓"}
                        {message.status === "delivered" && "✓✓"}
                        {message.status === "sent" && "✓"}
                        {message.status === "sending" && "..."}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[70%] rounded-lg bg-muted px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                      <Image className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send image</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                      <Mic className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Emoji</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                      <AtSign className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mention</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button type="submit" size="icon" className="rounded-full">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
        {/* Emoji Picker */}
        {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />}
      </div>

      {/* Conversation Info Panel - Now on the right side */}
      {showConversationInfo && (
        <ConversationInfo
          user={conversation.user}
          onClose={() => setShowConversationInfo(false)}
          onViewProfile={() => setShowProfileModal(true)}
          onSearchInConversation={() => setSearchOpen(true)}
          onBlockUser={() => setShowBlockUserAlert(true)}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        user={{
          ...conversation.user,
          email: "jane.smith@example.com",
          birthday: "January 15, 1990",
        }}
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Call Screen */}
      {/* <CallScreen
        user={conversation.user}
        callType={inCall === "audio" ? "audio" : "video"}
        open={!!inCall}
        onClose={() => setInCall(false)}
      /> */}

      {/* Block User Alert */}
      <BlockUserAlert
        userName={conversation.user.name}
        open={showBlockUserAlert}
        onClose={() => setShowBlockUserAlert(false)}
        onConfirm={() => {
          console.log("User blocked:", conversation.user.name)
          setShowBlockUserAlert(false)
        }}
      />

      {/* Search in Conversation */}
      <SearchConversation
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateToMessage={handleNavigateToMessage}
      />
    </div>
  )
}

