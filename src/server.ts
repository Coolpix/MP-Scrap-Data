import App from './app'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import loggerMiddleware from './Middlewares/logger'

// import ApiController from './Controllers/api.controller'
import ScraperController from './Controllers/scraper.controller'
// import { EventRepository } from './Repositories/EventRepository'
import Logger from "./Utils/logger";

const credentials = process.env.PATH_SERVICE_ACCOUNT || './madridpatina-cefb9-firebase-adminsdk.json';
const port: string | number = process.env.PORT || 8080;
const defaultLogLevel = process.env.DEFAULT_LOG_LEVEL || 'info';

const logger = new Logger(defaultLogLevel);
// const serviceAccount = require(credentials);
// const eventRepository = new EventRepository(serviceAccount);

const app = new App({
    port,
    logger,
    controllers: [
        // new ApiController(eventRepository),
        new ScraperController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: false }),
        cors(),
        loggerMiddleware(logger)
    ]
});

app.listen()

// https://github.com/aligoren/express-typescript-test