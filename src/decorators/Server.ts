import * as express from 'express'
import { defineRoutes } from './DefineRoutes'

export class Server {
    public app: express.Application
    constructor(Controllers: any[]) {
        this.app = express()
        this.routes(Controllers)
    }

    private routes(Controllers: any[]): void {
        defineRoutes(this.app, Controllers)
    }

    public use(
        mid: (
            req: express.Request,
            res: express.Response,
            next?: express.NextFunction
        ) => void
    ) {
        this.app.use(mid)
    }
}
