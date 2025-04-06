"use client";
import { ChatRoom } from "@/types/chat";
import ChatRoomCard, { ChatProps } from "./chat-room-card";

// Helper function to format time to HH:MM AM/PM
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const ChatList = ({
  chatRooms,
  activeConversationId,
  userId
}: {
  chatRooms: ChatRoom[];
  activeConversationId: string | undefined;
  userId: string;
}) => {
    const chats: ChatProps[] = chatRooms.map((chat) => ({
        id: chat._id,
        avatar: chat.members.find(member => member._id !== userId)?.avatar || "",
        name: chat.type == "group" ? chat.groupName : chat.members.find(member => member._id !== userId)?.username || "",
        online: true,
        unread: 0,
        lastMessage: chat.messages[0]?.content || "",
        timestamp: formatTime(chat.updatedAt)
    }));
    
    return (
        chats.length > 0 ? (
            <div className="space-y-1 p-2">
                {chats.map((conversation) => (
                    <ChatRoomCard key={conversation.id} conversation={conversation} activeConversationId={activeConversationId} />
                ))}
            </div>
        ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <p className="text-muted-foreground">
                    No conversations found
                </p>
            </div>
        )
    );
}

export default ChatList;