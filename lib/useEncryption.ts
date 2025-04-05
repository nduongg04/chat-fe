"use client";

import { useState, useEffect } from "react";
import {
    generateKeyPair,
    encryptMessage,
    decryptMessage,
    keyToBase64,
    base64ToKey,
} from "@/lib/encryption";

interface UseEncryptionReturn {
    publicKey: string | null;
    privateKey: string | null;
    encrypt: (message: string, receiverPublicKey: string) => string;
    decrypt: (encryptedMessage: string, senderPublicKey: string) => string;
    generateKeys: () => void;
    isReady: boolean;
}

export function useEncryption(): UseEncryptionReturn {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Load keys từ localStorage khi hook được mount
        const loadKeys = async () => {
            const storedPublicKey = localStorage.getItem("publicKey");
            const storedPrivateKey = localStorage.getItem("privateKey");

            if (storedPublicKey && storedPrivateKey) {
                setPublicKey(storedPublicKey);
                setPrivateKey(storedPrivateKey);
            }
            setIsReady(true);
        };

        loadKeys();
    }, []);

    const generateKeys = () => {
        const keyPair = generateKeyPair();
        const publicKeyBase64 = keyToBase64(keyPair.publicKey);
        const privateKeyBase64 = keyToBase64(keyPair.privateKey);

        setPublicKey(publicKeyBase64);
        localStorage.setItem("publicKey", publicKeyBase64);
        localStorage.setItem("privateKey", privateKeyBase64);

        return publicKeyBase64; // Trả về public key để sử dụng
    };

    const encrypt = (message: string, receiverPublicKey: string): string => {
        if (!privateKey) throw new Error("Private key not available");
        return encryptMessage(
            message,
            base64ToKey(privateKey),
            base64ToKey(receiverPublicKey)
        );
    };

    const decrypt = (encryptedMessage: string, senderPublicKey: string): string => {
        if (!privateKey) throw new Error("Private key not available");
        return decryptMessage(
            encryptedMessage,
            base64ToKey(privateKey),
            base64ToKey(senderPublicKey)
        );
    };

    return {
        publicKey,
        privateKey,
        encrypt,
        decrypt,
        generateKeys,
        isReady,
    };
}