import crypto from "crypto";

export function hmacSHA256(data: string, secret: string): Buffer {
    return crypto.createHmac("sha256", secret).update(data).digest();
}