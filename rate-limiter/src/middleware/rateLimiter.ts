import { IncomingMessage, ServerResponse } from "http";

interface Bucket {
    tokens: number;
    lastRefill: number;
}

const MAX_TOKENS = 10;
const REFILL_RATE = 2; // tokens per second

const buckets: Record<string, Bucket> = {};

export function rateLimiter(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
) {
    const ip = req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!buckets[ip]) {
        buckets[ip] = {
            tokens: MAX_TOKENS,
            lastRefill: now
        };
    }

    const bucket = buckets[ip];

    const timeElapsed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timeElapsed * REFILL_RATE);

    if (tokensToAdd > 0) {
        bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
    }

    if (bucket.tokens > 0) {
        bucket.tokens -= 1;
        next();
    } else {
        res.statusCode = 429;
        res.end("Too Many Requests");
    }
}