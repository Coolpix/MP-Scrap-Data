"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
class EventRepository {
    constructor() {
        this.serviceAccount = require('../../madridpatina-cefb9-firebase-adminsdk.json');
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount),
            databaseURL: `https://${this.serviceAccount.project_id}.firebaseio.com`,
        });
        const firestore = admin.firestore();
        firestore.settings({
            timestampsInSnapshots: true,
        });
        this.firestoreRepo = firestore.collection('events');
    }
    createEvent(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.firestoreRepo.doc(event.eventID).set(JSON.parse(JSON.stringify(event)));
        });
    }
    getEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.firestoreRepo.get();
        });
    }
    getEvent(eventID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const event = yield this.firestoreRepo.doc(eventID).get();
            return event.exists ? event.data() : null;
        });
    }
    getAvailableEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.getEventsFromState(false);
        });
    }
    getPastEvents() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.getEventsFromState(true);
        });
    }
    updateEvent(eventID, newEvent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.firestoreRepo.doc(eventID).set(JSON.parse(JSON.stringify(newEvent)));
            return newEvent;
        });
    }
    deleteEvent(eventID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.firestoreRepo.doc(eventID).delete();
            return eventID;
        });
    }
    getEventsFromState(state) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const eventsAvailable = [];
            const availableEvents = yield this.firestoreRepo.where('hasEnded', '==', state).get();
            for (const event of availableEvents.docs) {
                eventsAvailable.push(event.data());
            }
            return eventsAvailable.length === 0 ? {} : eventsAvailable;
        });
    }
}
exports.EventRepository = EventRepository;
//# sourceMappingURL=EventRepository.js.map