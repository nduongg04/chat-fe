import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";

interface MessageItemProps {
  currentUser: string;
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ currentUser, message }) => {
  const renderContent = () => {
    switch (message.messageType) {
      case "text":
        return (
          <div
            className={cn(
              "max-w-[70%] rounded-lg px-4 py-2",
              message.senderId === currentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p>{message.content}</p>
            <div
              className={cn(
                "mt-1 flex items-center justify-end gap-1 text-xs",
                message.senderId === currentUser
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              <span>{message.timestamp}</span>
              {message.senderId === currentUser && (
                <span>
                  {message.status === "read" && "✓✓"}
                  {message.status === "delivered" && "✓✓"}
                  {message.status === "sent" && "✓"}
                  {message.status === "sending" && "..."}
                </span>
              )}
            </div>
          </div>
        );

      case "image":
        return (
          <img
            src={message.fileUrl}
            alt="sent image"
            className="max-w-xs rounded-lg"
          />
          
        );

      case "video":
        return (
          <video controls className="max-w-xs rounded-lg">
            <source src={message.fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "file":
        return (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            📎 Download file
          </a>
        );

      default:
        return <p>Unsupported message type</p>;
    }
  };

  return (
    <div
      key={message.id}
      className={cn(
        "flex",
        message.senderId === currentUser ? "justify-end" : "justify-start"
      )}
    >
      {renderContent()}
    </div>
  );
};

export default MessageItem;
