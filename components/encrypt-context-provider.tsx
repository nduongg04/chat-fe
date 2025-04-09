// contexts/EncryptionContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import crypto from 'crypto-js';

interface EncryptionContextType {
    chatroomSecrets: Record<string, string>;
    encryptMessage: (chatroomId: string, content: string) => string;
    decryptMessage: (chatroomId: string, encryptedContent: string) => string;
    setChatroomSecret: (chatroomId: string, secret: string) => void;
}

const EncryptionContext = createContext<EncryptionContextType | null>(null);

export const EncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatroomSecrets, setChatroomSecrets] = useState<Record<string, string>>({});

    const setChatroomSecret = useCallback((chatroomId: string, secret: string) => {
        setChatroomSecrets(prev => ({ ...prev, [chatroomId]: secret }));
    }, []);

    const encryptMessage = useCallback((chatroomId: string, content: string): string => {
        const secret = chatroomSecrets[chatroomId];
        if (!secret) throw new Error('No encryption key for this chatroom');

        const iv = crypto.lib.WordArray.random(16); // 16 bytes = 128 bits
        const encrypted = crypto.AES.encrypt(content, secret, {
            iv,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        });

        return `${iv.toString()}:${encrypted.toString()}`;
    }, [chatroomSecrets]);

    const decryptMessage = useCallback((chatroomId: string, encryptedContent: string): string => {
        const secret = chatroomSecrets[chatroomId];
        if (!secret) throw new Error('No encryption key for this chatroom');

        const [ivHex, cipherText] = encryptedContent.split(':');
        if (!ivHex || !cipherText) throw new Error('Invalid encrypted message format');

        const iv = crypto.enc.Hex.parse(ivHex);
        const decrypted = crypto.AES.decrypt(cipherText, secret, {
            iv,
            mode: crypto.mode.CBC,
            padding: crypto.pad.Pkcs7
        });

        return decrypted.toString(crypto.enc.Utf8);
    }, [chatroomSecrets]);

    return (
        <EncryptionContext.Provider
            value={{
                chatroomSecrets,
                encryptMessage,
                decryptMessage,
                setChatroomSecret
            }}
        >
            {children}
        </EncryptionContext.Provider>
    );
};

export const useEncryption = () => {
    const context = useContext(EncryptionContext);
    if (!context) {
        throw new Error('useEncryption must be used within an EncryptionProvider');
    }
    return context;
};