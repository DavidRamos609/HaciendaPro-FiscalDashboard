/**
 * CryptoService.js - Seguridad Zero-Knowledge
 * Cifrado AES-256-GCM para que los datos solo sean legibles por el usuario.
 */
class CryptoService {
    async generateKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
        );
        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    async encrypt(data, password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.generateKey(password, salt);
        const encoder = new TextEncoder();
        const encryptedContent = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encoder.encode(JSON.stringify(data))
        );

        return {
            content: btoa(String.fromCharCode(...new Uint8Array(encryptedContent))),
            iv: btoa(String.fromCharCode(...iv)),
            salt: btoa(String.fromCharCode(...salt))
        };
    }

    async decrypt(encryptedData, password) {
        const salt = new Uint8Array(atob(encryptedData.salt).split("").map(c => c.charCodeAt(0)));
        const iv = new Uint8Array(atob(encryptedData.iv).split("").map(c => c.charCodeAt(0)));
        const content = new Uint8Array(atob(encryptedData.content).split("").map(c => c.charCodeAt(0)));
        const key = await this.generateKey(password, salt);

        const decryptedContent = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            content
        );

        return JSON.parse(new TextDecoder().decode(decryptedContent));
    }
}

export default new CryptoService();
