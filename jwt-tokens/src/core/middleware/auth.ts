import { IncomingMessage, ServerResponse } from "http";
import { verifyJwt } from "../jwt/jwt";

const SECRET = "supersecret";

export async function authenticate(
    req: IncomingMessage,
    res: ServerResponse
): Promise<any | null> {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.statusCode = 401;
        res.end("Unauthorized");
        return null;
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyJwt(token, SECRET);

    if (!payload) {
        res.statusCode = 401;
        res.end("Invalid or expired token");
        return null;
    }

    return payload;
}