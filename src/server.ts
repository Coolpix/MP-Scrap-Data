import App from './app'

import * as bodyParser from 'body-parser'
import cors from 'cors'
import loggerMiddleware from './middlewares/logger'

import ApiController from './controllers/api.controller'
import ScraperController from './controllers/scraper.controller'
import { EventRepository } from './Repositories/EventRepository'
import Logger from "./utils/logger";

const credentials = process.env.PATH_SERVICE_ACCOUNT || './madridpatina-cefb9-firebase-adminsdk.json';
const port: string | number = process.env.PORT || 8080;
const defaultLogLevel = process.env.DEFAULT_LOG_LEVEL || 'info';

const logger = new Logger(defaultLogLevel);
const serviceAccount = require(credentials);

((eventRepository: EventRepository) => {
    const app = new App({
        port,
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

})(new EventRepository(serviceAccount))

// https://github.com/aligoren/express-typescript-test