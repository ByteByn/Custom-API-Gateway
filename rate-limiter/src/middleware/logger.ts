import { IncomingMessage, ServerResponse } from "http";

export function logger(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void
) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
            `${req.method} ${req.url} | ${res.statusCode} | ${duration}ms`
        );
    });

    next();
}