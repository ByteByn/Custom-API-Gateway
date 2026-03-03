import { IncomingMessage, ServerResponse } from "http";
import { Middleware, RouteHandler } from "./types";

export class App {
    private middlewares: Middleware[] = [];
    private routes: Map<string, RouteHandler> = new Map();

    use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    get(path: string, handler: RouteHandler) {
        this.routes.set(`GET:${path}`, handler);
    }

    handle(req: IncomingMessage, res: ServerResponse) {
        let index = 0;

        const next = () => {
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index++];
                middleware(req, res, next);
            } else {
                this.handleRoute(req, res);
            }
        };

        next();
    }

    private handleRoute(req: IncomingMessage, res: ServerResponse) {
        const key = `${req.method}:${req.url}`;
        const route = this.routes.get(key);

        if (route) {
            route(req, res);
        } else {
            res.statusCode = 404;
            res.end("Not Found");
        }
    }
}