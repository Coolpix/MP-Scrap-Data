"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(eventID, name, imgUrl, month, monthDigit, date, unixTime, textTimeToEvent, hasEnded, type, totalSpots, totalPeopleJoined, imgAltimetryURL, usersJoined) {
        this.id = eventID;
        this.eventID = eventID;
        this.name = name;
        this.imgUrl = imgUrl;
        this.month = month;
        this.monthDigit = parseInt(monthDigit);
        this.date = date;
        this.unixTime = parseInt(unixTime);
        this.textTimeToEvent = textTimeToEvent;
        this.hasEnded = hasEnded;
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
//# sourceMappingURL=event.js.map