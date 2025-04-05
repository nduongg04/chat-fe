"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AtSign, Image, Info, Mic, Paperclip, Phone, Send, Smile, Video, Lock, LockOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useEncryption } from "@/lib/useEncryption"
import { toastError, toastSuccess } from "@/lib/toast"

// Components
import { ProfileModal } from "@/components/profile-modal"
import { CallScreen } from "@/components/call-screen"
import { BlockUserAlert } from "@/components/block-user-alert"
import { SearchConversation } from "@/components/search-conversation"
import { ConversationInfo } from "@/components/conversation-info"
import { EmojiPicker } from "@/components/emoji-picker"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  status: "sending" | "sent" | "delivered" | "read"
  encryptedContent?: string
  isEncrypted?: boolean
}

interface User {
  id: string
  name: string
  avatar: string
  status: string
  publicKey?: string
}

interface Conversation {
  id: string
  user: User
  messages: Message[]
}

interface ChatInterfaceProps {
  conversation: Conversation
}

export function ChatInterface({ conversation: initialConversation }: ChatInterfaceProps) {
  // State management
  const [conversation, setConversation] = useState(initialConversation)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showConversationInfo, setShowConversationInfo] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [inCall, setInCall] = useState<false | "audio" | "video">(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showBlockUserAlert, setShowBlockUserAlert] = useState(false)
  const [showEncryptionDialog, setShowEncryptionDialog] = useState(false)
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Encryption hook
  const {
    publicKey,
    privateKey,
    encrypt,
    decrypt,
    generateKeys,
  } = useEncryption()

  /// Effects
  useEffect(() => {
    setIsEncryptionEnabled(!!(conversation.user.publicKey && publicKey))
  }, [conversation.user.publicKey, publicKey])

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(Math.random() > 0.7)
    }, 3000)

    return () => clearTimeout(typingTimeout)
  }, [conversation.messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages, isTyping, forceUpdate])

  // Message handlers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    let messageContent = newMessage
    let isEncrypted = false

    if (isEncryptionEnabled && conversation.user.publicKey) {
      try {
        messageContent = encrypt(newMessage, conversation.user.publicKey)
        isEncrypted = true
      } catch (error) {
        console.error("Encryption failed:", error)
        toastError("Failed to encrypt message")
        return
      }
    }

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: "currentUser",
      content: isEncrypted ? "Encrypted message" : messageContent,
      encryptedContent: isEncrypted ? messageContent : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
      isEncrypted,
    }

    setNewMessage("")

    setTimeout(() => {
      optimisticMessage.status = "sent"
      setForceUpdate(prev => !prev)
    }, 500)

    setTimeout(() => {
      optimisticMessage.status = "delivered"
      setForceUpdate(prev => !prev)
    }, 1500)
  }

  const decryptMessageContent = (message: Message): string => {
    if (!message.isEncrypted || !message.encryptedContent) return message.content
    if (!privateKey) return "🔒 Encrypted message (unable to decrypt)"

    try {
      return decrypt(message.encryptedContent, conversation.user.publicKey!)
    } catch (error) {
      console.error("Decryption failed:", error)
      return "🔒 Error decrypting message"
    }
  }

  // Encryption handlers
  const handleAddPublicKey = (key: string) => {
    if (!key.trim()) {
      toastError("Please enter a valid public key")
      return
    }

    try {
      setConversation(prev => ({
        ...prev,
        user: {
          ...prev.user,
          publicKey: key
        }
      }))
      toastSuccess("Public key added successfully")
      setIsEncryptionEnabled(true)
    } catch (error) {
      toastError("Failed to add public key")
    }
  }

  const handleGenerateKeys = () => {
    const newPublicKey = generateKeys()
    toastSuccess(
      "Encryption Keys Generated",
      "Your encryption keys have been created successfully"
    )
    return newPublicKey
  }

  // UI components
  const renderEncryptionDialog = () => (
    <AlertDialog open={showEncryptionDialog} onOpenChange={setShowEncryptionDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End-to-End Encryption</AlertDialogTitle>
          <div className="text-sm text-muted-foreground">
            {publicKey ? (
              <div className="space-y-4">
                <p>Your encryption keys are ready. To enable secure messaging:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Share your public key with the recipient</li>
                  <li>Get their public key and add it to their profile</li>
                  <li>All messages will be encrypted automatically</li>
                </ol>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Your Public Key:</p>
                  <code className="text-xs break-all">{publicKey}</code>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Generate encryption keys to enable end-to-end encrypted messaging.</p>
                <p>This will create a unique key pair that only you can decrypt.</p>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {publicKey ? (
            <AlertDialogAction onClick={() => setShowEncryptionDialog(false)}>
              Done
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={handleGenerateKeys}>
              Generate Keys
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  const renderMessageContent = (message: Message) => (
    <>
      {message.isEncrypted && (
        <div className="flex items-center gap-1 mb-1">
          <Lock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Encrypted</span>
        </div>
      )}
      <p>{decryptMessageContent(message)}</p>
    </>
  )

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
                {isEncryptionEnabled && (
                  <span className="flex items-center gap-1 mt-1">
                    <Lock className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 text-xs">End-to-end encrypted</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowEncryptionDialog(true)}
                  >
                    {isEncryptionEnabled ? (
                      <Lock className="h-5 w-5 text-green-500" />
                    ) : (
                      <LockOpen className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isEncryptionEnabled ? "Encryption enabled" : "Enable encryption"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setInCall("audio")}>
                    <Phone className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice call</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setInCall("video")}>
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
                  {message.isEncrypted && (
                    <div className="flex items-center gap-1 mb-1">
                      <Lock className="h-3 w-3" />
                      <span className="text-xs">Encrypted</span>
                    </div>
                  )}
                  {renderMessageContent(message)}
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
              placeholder={isEncryptionEnabled ? "Type an encrypted message..." : "Type a message..."}
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

      {/* Conversation Info Panel */}
      {showConversationInfo && (
        <ConversationInfo
          user={conversation.user}
          onClose={() => setShowConversationInfo(false)}
          onViewProfile={() => setShowProfileModal(true)}
          onSearchInConversation={() => setSearchOpen(true)}
          onBlockUser={() => setShowBlockUserAlert(true)}
          onAddPublicKey={handleAddPublicKey}
          currentUserPublicKey={publicKey}
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
      <CallScreen
        user={conversation.user}
        callType={inCall === "audio" ? "audio" : "video"}
        open={!!inCall}
        onClose={() => setInCall(false)}
      />

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

      {/* Encryption Dialog */}
      {renderEncryptionDialog()}
    </div>
  )
}
