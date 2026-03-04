import http from "http";
import { signJwt } from "./core/jwt/jwt";
import { authenticate } from "./core/middleware/auth";

const SECRET = "supersecret";

const server = http.createServer(async (req, res) => {

    if (req.method === "POST" && req.url === "/login") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const { userId } = JSON.parse(body);

            const token = signJwt(
                { sub: userId, role: "user" },
                SECRET,
                60 * 60
            );

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ token }));
        });

        return;
    }

    if (req.method === "GET" && req.url === "/protected") {

        const user = await authenticate(req, res);
        if (!user) return;

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            message: "Protected route accessed",
            user
        }));

        return;
    }

    res.statusCode = 404;
    res.end("Not Found");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});