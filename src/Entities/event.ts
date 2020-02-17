export class Event {

    id: string
    eventID: string
    name: string
    imgUrl: string
    month: string
    monthDigit: number
    date: string
    unixTime: number
    textTimeToEvent: string
    hasEnded: boolean
    type: string
    totalSpots: number
    totalPeopleJoined: number
    totalSpotsAvalaible: number
    imgAltimetryURL: string
    usersJoined: object[]

    constructor(eventID: string, name: string, imgUrl: string, month: string, monthDigit: string, date: string, unixTime: string, textTimeToEvent: string, hasEnded: boolean, type: string, totalSpots: string, totalPeopleJoined: string, imgAltimetryURL: string, usersJoined: object[]) {
        this.id = eventID
        this.eventID = eventID
        this.name = name
        this.imgUrl = imgUrl
        this.month = month
        this.monthDigit = parseInt(monthDigit, 10)
        this.date = date
        this.unixTime = parseInt(unixTime, 10)
        this.textTimeToEvent = textTimeToEvent
        this.hasEnded = hasEnded
        this.type = type
        this.totalSpots = parseInt(totalSpots, 10)
        this.totalPeopleJoined = parseInt(totalPeopleJoined, 10)
        this.totalSpotsAvalaible = this.totalSpots - this.totalPeopleJoined
        this.imgAltimetryURL = imgAltimetryURL
        this.usersJoined = usersJoined
    }

    // Mock method, just to avoid type error on firestore get method on collection
    data(): Event {
        throw new Error("Method not implemented.")
    }
}
