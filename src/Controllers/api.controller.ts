import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../Interfaces/IControllerBase'
import { EventRepository } from '../Repositories/EventRepository'
import { Event } from '../Entities/event'

class ApiController implements IControllerBase {
    public path = '/'
    public router = express.Router()
    private eventRepository: EventRepository

    constructor(eventRepository: EventRepository) {
        this.initRoutes()
        this.eventRepository = eventRepository
    }

    public initRoutes() {
        this.router.get('/events', this.getEvents)
        this.router.get('/available_events', this.getAvailableEvents)
        this.router.get('/past_events', this.getPastEvents)
        this.router.get('/event/:eventID', this.getEvent)
    }

    getEvents = async (req: Request, res: Response) => {
        const events = await this.eventRepository.getEvents()
        const allEvents: Event[] = []
        events.forEach((doc) => {
          allEvents.push(doc.data())
        })
        res.send(allEvents)
    }

    getAvailableEvents = async (req: Request, res: Response) => {
        const availableEvents = await this.eventRepository.getAvailableEvents()
        res.send(availableEvents)
    }

    getPastEvents = async (req: Request, res: Response) => {
        const pastEvents = await this.eventRepository.getPastEvents()
        res.send(pastEvents)
    }

    getEvent = async (req: Request, res: Response) => {
        const event = await this.eventRepository.getEvent(req.params.eventID)
        if (event) {
            res.send(event)
        } else {
            res.status(404).send({'message': `El evento ${req.params.eventID} no ha sido encontrado`})
        }        
    }
}

export default ApiController