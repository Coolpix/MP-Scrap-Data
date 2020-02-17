import express, { Application } from 'express'
import Logger from './utils/logger';

class App {
    public app: Application
    public port: number
    public logger: Logger;

    constructor(appInit: { port: number; middleWares: any; controllers: any; logger: Logger}) {
        this.app = express()
        this.port = appInit.port
        this.logger = appInit.logger;

        this.middlewares(appInit.middleWares)
        this.routes(appInit.controllers)
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
           this.logger.info(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default App