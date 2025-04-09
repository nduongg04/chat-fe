// components/ChatInput.tsx
import React, { useState } from 'react';
import { useEncryption } from '../contexts/EncryptionContext';
import { sendMessage } from '../api/chatApi';

interface ChatInputProps {
    chatroomId: string;
    currentUserId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ chatroomId, currentUserId }) => {
    const [message, setMessage] = useState('');
    const { encryptMessage } = useEncryption();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        try {
            // Encrypt message before sending
            const encryptedContent = encryptMessage(chatroomId, message);

            await sendMessage({
                chatroomId,
                senderId: currentUserId,
                encryptedContent
            });

            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please check your encryption key.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input-form">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
            />
            <button type="submit" className="send-button">
                Send
            </button>
        </form>
    );
};