import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../Interfaces/IControllerBase'
import { EventRepository } from '../Repositories/EventRepository'
import { Event } from '../Entities/event'
import { Scraper } from '../Services/scrapers'

class ScraperController implements IControllerBase {
    public path = '/'
    public router = express.Router()
    private eventRepository: EventRepository
    private scraper: Scraper

    constructor(eventRepository: EventRepository) {
        this.initRoutes()
        this.eventRepository = eventRepository
        this.scraper = new Scraper("http://www.madridpatina.com")
    }

    public initRoutes() {
        this.router.get('/scrape_events', this.scrapeEvents)
        this.router.get('/force_event/:eventID', this.forceScrape)
    }

    scrapeEvents = async (req: Request, res: Response) => {
        const urlsActiveEvents = await this.scraper.scrapeEvents()
        if (urlsActiveEvents) {
          const events = urlsActiveEvents.map(async (link: string) => {
            const eventId = link.split("=")[1]
            const event = await this.eventRepository.getEvent(eventId)
            // console.log(`Encontrado evento ${eventId}`)
            const eventData = await this.scraper.scrapeEvent(eventId)
            if (eventData.hasEnded && event?.hasEnded === true) {
              return {
                "message": `El evento ${eventId} ya ha acabado, no se actualiza`
              }
            }
            return event?await this.eventRepository.updateEvent(eventId, eventData):await this.eventRepository.createEvent(eventData)
          })
          if (events.length > 0) {
            Promise.all(events).then((data: any) => {
              res.send(data)
            })
          }
        }
    }

    forceScrape = async (req: Request, res: Response) => {
        const eventId = req.params.eventID
        // console.log(`Forzando el scrapping del evento ${eventId}`)
        const event = await this.eventRepository.getEvent(eventId)
        const eventData = await this.scraper.scrapeEvent(eventId)
        const eventInfo: Event = event?await this.eventRepository.updateEvent(eventId, eventData):await this.eventRepository.createEvent(eventData)
        res.send(eventInfo)
    }
}

export default ScraperController