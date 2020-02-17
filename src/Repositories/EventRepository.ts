import { Event } from '../Entities/event'
import * as admin from 'firebase-admin'

export class EventRepository {

    private firestoreRepo: any
    private serviceAccount: any

    constructor(){
        this.serviceAccount = require('../../madridpatina-cefb9-firebase-adminsdk.json');
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: `https://${this.serviceAccount.project_id}.firebaseio.com`,
        })

        const firestore = admin.firestore()
        firestore.settings({
            timestampsInSnapshots: true,
        })

        this.firestoreRepo = firestore.collection('events')
    }

    async createEvent(event: Event): Promise<Event> {
        return await this.firestoreRepo.doc(event.eventID).set(JSON.parse(JSON.stringify(event)))
    }

    async getEvents(): Promise<Event[]> {
         return await this.firestoreRepo.get()
    }

    async getEvent(eventID: string): Promise<Event | undefined> {
        const event = await this.firestoreRepo.doc(eventID).get()
        return event.exists?event.data():null
    }

    async getAvailableEvents(): Promise<Event | undefined | object> {
        return await this.getEventsFromState(false)
    }

    async getPastEvents(): Promise<Event | undefined | object> {
        return await this.getEventsFromState(true)
    }

    async updateEvent(eventID: string, newEvent: Event): Promise<Event> {
        await this.firestoreRepo.doc(eventID).set(JSON.parse(JSON.stringify(newEvent)))
        return newEvent
    }

    async deleteEvent(eventID: string): Promise<string> {
        await this.firestoreRepo.doc(eventID).delete()
        return eventID
    }

    private async getEventsFromState(state:boolean) {
        const eventsAvailable: Event[] = []
        const availableEvents = await this.firestoreRepo.where('hasEnded', '==', state).get()
        for (const event of availableEvents.docs) {
            eventsAvailable.push(event.data())
        }
        return eventsAvailable.length === 0 ? {} : eventsAvailable
    }
}