import { base64UrlEncode, base64UrlDecode } from "../crypto/base64url";
import { hmacSHA256 } from "../crypto/hmac";
import { now } from "../utils/time";
import { JwtPayload } from "./types";

const HEADER = {
    alg: "HS256",
    typ: "JWT"
};

export function signJwt(
    payload: { sub: string; role?: string },
    secret: string,
    expiresIn: number
): string {
    const iat = now();
    const exp = iat + expiresIn;

    const fullPayload: JwtPayload = {
        ...payload,
        iat,
        exp
    };

    const encodedHeader = base64UrlEncode(
        Buffer.from(JSON.stringify(HEADER))
    );

    const encodedPayload = base64UrlEncode(
        Buffer.from(JSON.stringify(fullPayload))
    );

    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = base64UrlEncode(
        hmacSHA256(data, secret)
    );

    return `${data}.${signature}`;
}

export function verifyJwt(
    token: string,
    secret: string
): JwtPayload | null {

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    const data = `${header}.${payload}`;

    const expectedSignature = base64UrlEncode(
        hmacSHA256(data, secret)
    );

    if (signature !== expectedSignature) return null;

    const decodedPayload = JSON.parse(
        base64UrlDecode(payload).toString()
    );

    if (decodedPayload.exp < now()) return null;

    return decodedPayload;
}