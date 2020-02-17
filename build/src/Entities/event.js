"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(eventID, name, imgUrl, month, date, type, totalSpots, totalPeopleJoined, imgAltimetryURL, usersJoined) {
        this.id = eventID;
        this.eventID = eventID;
        this.name = name;
        this.imgUrl = imgUrl;
        this.month = month;
        this.date = date;
        this.type = type;
        this.totalSpots = parseInt(totalSpots);
        this.totalPeopleJoined = parseInt(totalPeopleJoined);
        this.totalSpotsAvalaible = this.totalSpots - this.totalPeopleJoined;
        this.imgAltimetryURL = imgAltimetryURL;
        this.usersJoined = usersJoined;
    }
    //Mock method, just to avoid type error on firestore get method on collection
    data() {
        throw new Error("Method not implemented.");
    }
}
exports.Event = Event;
