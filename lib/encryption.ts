import sodium from "libsodium-wrappers";

// Đợi libsodium khởi tạo
await sodium.ready;

interface KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}

// Tạo cặp khóa public/private
export function generateKeyPair(): KeyPair {
    const keyPair = sodium.crypto_box_keypair();
    return {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
    };
}

// Mã hóa tin nhắn
export function encryptMessage(
    message: string,
    senderPrivateKey: Uint8Array,
    receiverPublicKey: Uint8Array
): string {
    // Tạo nonce ngẫu nhiên
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

    // Chuyển đổi tin nhắn thành Uint8Array
    const messageBytes = sodium.from_string(message);

    // Mã hóa tin nhắn
    const encryptedMessage = sodium.crypto_box(
        messageBytes,
        nonce,
        receiverPublicKey,
        senderPrivateKey
    );

    // Kết hợp nonce và tin nhắn đã mã hóa thành một mảng
    const combined = new Uint8Array(nonce.length + encryptedMessage.length);
    combined.set(nonce);
    combined.set(encryptedMessage, nonce.length);

    // Chuyển đổi thành chuỗi base64 để lưu trữ/dễ dàng truyền
    return sodium.to_base64(combined);
}

// Giải mã tin nhắn
export function decryptMessage(
    encryptedData: string,
    receiverPrivateKey: Uint8Array,
    senderPublicKey: Uint8Array
): string {
    // Chuyển đổi từ base64 trở lại Uint8Array
    const combined = sodium.from_base64(encryptedData);

    // Tách nonce và tin nhắn đã mã hóa
    const nonce = combined.slice(0, sodium.crypto_box_NONCEBYTES);
    const encryptedMessage = combined.slice(
        sodium.crypto_box_NONCEBYTES,
        combined.length
    );

    // Giải mã tin nhắn
    const decryptedMessage = sodium.crypto_box_open(
        encryptedMessage,
        nonce,
        senderPublicKey,
        receiverPrivateKey
    );

    if (!decryptedMessage) {
        throw new Error("Failed to decrypt message");
    }

    // Chuyển đổi thành chuỗi UTF-8
    return sodium.to_string(decryptedMessage);
}

// Helper để chuyển đổi Uint8Array sang base64
export function keyToBase64(key: Uint8Array): string {
    return sodium.to_base64(key);
}

// Helper để chuyển đổi base64 sang Uint8Array
export function base64ToKey(base64: string): Uint8Array {
    return sodium.from_base64(base64);
}