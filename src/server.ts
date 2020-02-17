import App from './app'

import * as bodyParser from 'body-parser'
import cors from 'cors'
import loggerMiddleware from './middlewares/logger'

import ApiController from './controllers/api.controller'
import ScraperController from './controllers/scraper.controller'
import { EventRepository } from './Repositories/EventRepository'
import Logger from "./utils/logger";

const logger = new Logger('info');

((eventRepository: EventRepository) => {
    const app = new App({
        port: 8080,
        logger,
        controllers: [
            new ApiController(eventRepository),
            new ScraperController(eventRepository)
        ],
        middleWares: [
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true }),
            cors(),
            loggerMiddleware(logger)
        ]
    })

    app.listen()

})(new EventRepository())

// https://github.com/aligoren/express-typescript-test