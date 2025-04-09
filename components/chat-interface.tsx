"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AtSign,
  Image,
  Info,
  Mic,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Add these imports at the top
import { ProfileModal } from "@/components/profile-modal";
import { CallScreen } from "@/components/call-screen";
import { BlockUserAlert } from "@/components/block-user-alert";
import { SearchConversation } from "@/components/search-conversation";
import { ConversationInfo } from "@/components/conversation-info";
import { EmojiPicker } from "@/components/emoji-picker";
import { ChatRoom, Member, Message } from "@/types/chat";
import { deleteConversation } from "@/services/chatService";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { date } from "zod";
import MessageItem from "./message-item";
import axios from "axios";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

interface Conversation {
  id: string;
  user: User;
  messages: Message[];
}

interface ChatInterfaceProps {
  conversation: ChatRoom;
  isOnline: boolean;
}

export function ChatInterface({ conversation, isOnline }: ChatInterfaceProps) {
  const { data: session } = useSession();
  const accessToken = session?.user.accessToken;
  const userId = session?.user.id;
  const user: Member = {
    _id: session?.user.id!,
    username: session?.user.username!,
    avatar: session?.user.avatar,
  };
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inCall, setInCall] = useState<false | "audio" | "video">(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add these state variables inside the component
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBlockUserAlert, setShowBlockUserAlert] = useState(false);
  // const [showNewConversationDialog, setShowNewConversationDialog] = useState(false)

  const normalizeMessages = (data: { messages: any[] }) => {
    return data.messages.map(
      (item) =>
        ({
          id: item._id,
          chatId: item.chatId,
          senderId: item.senderId._id,
          messageType: item.messageType,
          content: item.content,
          fileUrl: item.fileUrl[0],
          timestamp: item.createdAt,
          status: item.readBy.length > 1 ? "read" : "sent",
        } as Message)
    );
  };

  const normalizeOneMessage = (data: any): Message => {
    return {
      id: data._id,
      chatId: data.chatId,
      senderId: data.senderId,
      messageType: data.messageType,
      content: data.content,
      fileUrl: data.fileUrl[0],
      timestamp: data.createdAt,
      status: data.readBy.length > 1 ? "read" : "sent",
    };
  };
  // Verify socket
  useEffect(() => {
    if (!accessToken) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token: accessToken },
    });

    setSocket(newSocket);
    console.log("session", session);
    console.log("user", user);

    // Join room with correct room name
    newSocket.emit("join_chat", {
      chatId: conversation._id,
      token: accessToken,
    });
    newSocket.on("load_chat", (data) => {
      // console.log('data',data.data);
      //  console.log("data type", typeof(data.data));
      const normalizedMessages = normalizeMessages(data.data);
      conversation.messages = normalizedMessages;
      setForceUpdate((prev) => !prev);
    });
    newSocket.on("receive", (data) => {
      console.log("msg data", data);
      const normalizedMessage = normalizeOneMessage(data.data);
      console.log("msg", normalizedMessage);
      conversation.messages.push(normalizedMessage);
      setForceUpdate((prev) => !prev);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken, conversation._id]);

  // Simulate typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(Math.random() > 0.7);
    }, 3000);

    return () => clearTimeout(typingTimeout);
  }, [conversation.messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isTyping, forceUpdate]);

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !userId) return;
    const message: Message = {
      id: `temp-${Date.now()}`,
      chatId: conversation._id,
      senderId: userId,
      content: newMessage,
      fileUrl: "",
      messageType: "text",
      timestamp: new Date().toISOString(),
      status: "sending",
    };
    // send
    conversation.messages.push(message);
    setForceUpdate((prev) => !prev);
    socket.emit("send", message);
    console.log("send: ", message);
    // update
    const index = conversation.messages.findIndex((m) => m.id === message.id);
    conversation.messages[index] = {
      ...message,
      status: "sent",
    };
    setForceUpdate((prev) => !prev);
    setNewMessage("");
  };

  //Upload file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!socket || !userId) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      const form = new FormData();
      form.append("chatId", conversation._id);
      form.append("senderId", userId);
      form.append("messageType", "image");
      form.append("file", file);
      //console.log('form',form);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL!}/messages/send`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        socket.emit("send_image", response.data);
        console.log("image msg", response.data.data);
      } catch (error) {
        console.log("error", error);
      }
    });

    e.target.value = "";
  };
  // Add this function to handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Add this function to handle message navigation
  const handleNavigateToMessage = (messageId: string) => {
    // In a real app, this would scroll to the message
    console.log("Navigating to message:", messageId);
  };
const openCall = (callType: "audio" | "video", id: string) => {
  console.log("Opening call:", callType, id);
  const url = `/call/${id}?type=${callType}`;
  window.open(url, "_blank", "width=800,height=600");
};
  return (
    <div className="flex h-full flex-1">
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage
                  src={
                    conversation.members.find((member) => member._id !== userId)
                      ?.avatar || ""
                  }
                  alt={
                    conversation.members.find((member) => member._id !== userId)
                      ?.username || ""
                  }
                />
                <AvatarFallback>
                  {conversation.type == "group"
                    ? conversation.groupName.charAt(0)
                    : conversation.members
                        .find((member) => member._id !== userId)
                        ?.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
              )}
            </div>
            <div>
              <h2 className="font-medium">
                {conversation.type == "group"
                  ? conversation.groupName
                  : conversation.members.find((member) => member._id !== userId)
                      ?.username}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isOnline ? "Online" : "Offline"}
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
                    onClick={() =>
                      openCall(
                        "audio",
                        conversation.members.find(
                          (member) => member._id !== userId
                        )?._id || ""
                      )
                    }
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice call</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      openCall(
                        "video",
                        conversation.members.find(
                          (member) => member._id !== userId
                        )?._id || ""
                      )
                    }
                  >
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
                    onClick={() =>
                      setShowConversationInfo(!showConversationInfo)
                    }
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
              <MessageItem
                currentUser={user}
                room={conversation}
                message={message}
              />
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
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send image</TooltipContent>
                </Tooltip>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  onSubmit={() => {}}
                />
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
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
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </div>

      {/* Conversation Info Panel - Now on the right side */}
      {showConversationInfo && (
        <ConversationInfo
          user={{
            id: conversation._id,
            name:
              conversation.type == "group"
                ? conversation.groupName
                : conversation.members.find((member) => member._id !== userId)
                    ?.username || "",
            avatar:
              conversation.members.find((member) => member._id !== userId)
                ?.avatar || "",
            status: "online",
          }}
          isGroup={conversation.type == "group"}
          onClose={() => setShowConversationInfo(false)}
          onViewProfile={() => setShowProfileModal(true)}
          onSearchInConversation={() => setSearchOpen(true)}
          onBlockUser={() => setShowBlockUserAlert(true)}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        user={{
          id:
            conversation.members.find((member) => member._id !== userId)?._id ||
            "",
          name:
            conversation.type == "group"
              ? conversation.groupName
              : conversation.members.find((member) => member._id !== userId)
                  ?.username || "",
          avatar:
            conversation.members.find((member) => member._id !== userId)
              ?.avatar || "",
          status: "online",
          email: "jane.smith@example.com",
          birthday: "January 15, 1990",
        }}
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Call Screen */}
      {/* <CallScreen
        user={{
          id:
            conversation.members.find((member) => member._id !== userId)?._id ||
            "",
          name:
            conversation.type == "group"
              ? conversation.groupName
              : conversation.members.find((member) => member._id !== userId)
                  ?.username || "",
          avatar:
            conversation.members.find((member) => member._id !== userId)
              ?.avatar || "",
        }}
        callType={inCall === "audio" ? "audio" : "video"}
        open={!!inCall}
        onClose={() => setInCall(false)}
      /> */}

      {/* Block User Alert */}
      <BlockUserAlert
        userName={
          conversation.type == "group"
            ? conversation.groupName
            : conversation.members.find((member) => member._id !== userId)
                ?.username || ""
        }
        open={showBlockUserAlert}
        onClose={() => setShowBlockUserAlert(false)}
        onConfirm={() => {
          const deleteChat = async () => {
            try {
              const isDeleted = await deleteConversation(
                accessToken || "",
                conversation._id
              );
              if (isDeleted) {
                router.push("/chat");
                setShowBlockUserAlert(false);
              }
            } catch (error) {
              toast.error("Failed to delete conversation");
            }
          };
          deleteChat();
        }}
      />

      {/* Search in Conversation */}
      <SearchConversation
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateToMessage={handleNavigateToMessage}
      />
    </div>
  );
}
