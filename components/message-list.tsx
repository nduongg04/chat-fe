// components/MessageList.tsx
import React from 'react';
import { useEncryption } from '../contexts/EncryptionContext';

interface Message {
    id: string;
    senderId: string;
    encryptedContent: string;
    createdAt: string;
}

interface MessageListProps {
    messages: Message[];
    chatroomId: string;
    currentUserId: string;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    chatroomId,
    currentUserId
}) => {
    const { decryptMessage } = useEncryption();

    return (
        <div className="message-list">
            {messages.map((msg) => {
                try {
                    const decryptedContent = decryptMessage(chatroomId, msg.encryptedContent);

                    return (
                        <div
                            key={msg.id}
                            className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
                        >
                            <div className="message-content">{decryptedContent}</div>
                            <div className="message-time">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </div>
                        </div>
                    );
                } catch (error) {
                    console.error('Failed to decrypt message:', error);
                    return (
                        <div key={msg.id} className="message error">
                            Could not decrypt this message
                        </div>
                    );
                }
            })}
        </div>
    );
};