"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const admin = tslib_1.__importStar(require("firebase-admin"));
class EventRepository {
    constructor() {
        this.serviceAccount = require('../../madridpatina-cefb9-firebase-adminsdk-vgy89-1c36e9f2d7.json');
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
            if (!event.exists) {
                console.log("No existe el evento en Firestore");
            }
            else {
                return event.data;
            }
        });
    }
    updateEvent(eventID, newEvent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.firestoreRepo.doc(eventID).set(JSON.parse(JSON.stringify(newEvent)));
        });
    }
    deleteEvent(eventID) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.firestoreRepo.doc(eventID).delete();
        });
    }
}
exports.EventRepository = EventRepository;
