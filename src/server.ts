import App from './app'

import * as bodyParser from 'body-parser'

import ApiController from './controllers/api.controller'
import ScraperController from './controllers/scraper.controller'
import { EventRepository } from './Repositories/EventRepository'


((eventRepository: EventRepository) => {
    const app = new App({    
        port: 8080,
        controllers: [
            new ApiController(eventRepository),
            new ScraperController(eventRepository)
        ],
        middleWares: [
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true })
        ]
    })

    app.listen()    
})(new EventRepository())

//https://github.com/aligoren/express-typescript-test