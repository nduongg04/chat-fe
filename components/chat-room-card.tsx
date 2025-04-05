import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatProps {
    id: string,
    avatar: string,
    name: string,
    online: boolean,
    unread: number,
    lastMessage: string,
    timestamp: string,
}

const ChatRoomCard = ({ conversation, activeConversationId }: { conversation: ChatProps, activeConversationId: string | undefined }) => {   
    return (
        <Link
            key={conversation.id}
            href={`/chat/${conversation.id}`}
            className={cn(
                "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
                activeConversationId === conversation.id &&
                    "bg-muted"
            )}
        >
            <div className="relative">
                <Avatar>
                    <AvatarImage
                        src={conversation.avatar}
                        alt={conversation.name}
                    />
                    <AvatarFallback>
                        {conversation.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                        {conversation.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                    </p>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                    {conversation.lastMessage}
                </p>
            </div>
            {conversation.unread > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {conversation.unread}
                </div>
            )}
        </Link>
    )
}

export default ChatRoomCard;
