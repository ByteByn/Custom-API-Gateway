import http from "http";
import { App } from "./core/app";
import { rateLimiter } from "./middleware/rateLimiter";
import { logger } from "./middleware/logger";

const app = new App();

app.use(logger);
app.use(rateLimiter);

app.get("/", (req, res) => {
    res.statusCode = 200;
    res.end("Custom API Gateway Running 🚀");
});

const server = http.createServer((req, res) => {
    app.handle(req, res);
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});