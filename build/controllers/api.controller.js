"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = tslib_1.__importStar(require("express"));
class ApiController {
    constructor(eventRepository) {
        this.path = '/';
        this.router = express.Router();
        this.getEvents = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const events = yield this.eventRepository.getEvents();
            const allEvents = [];
            events.forEach((doc) => {
                allEvents.push(doc.data());
            });
            res.send(allEvents);
        });
        this.getAvailableEvents = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const availableEvents = yield this.eventRepository.getAvailableEvents();
            res.send(availableEvents);
        });
        this.getPastEvents = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const pastEvents = yield this.eventRepository.getPastEvents();
            res.send(pastEvents);
        });
        this.getEvent = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventRepository.getEvent(req.params.eventID);
            if (event) {
                res.send(event);
            }
            else {
                res.status(404).send({ 'message': `El evento ${req.params.eventID} no ha sido encontrado` });
            }
        });
        this.initRoutes();
        this.eventRepository = eventRepository;
    }
    initRoutes() {
        this.router.get('/events', this.getEvents);
        this.router.get('/available_events', this.getAvailableEvents);
        this.router.get('/past_events', this.getPastEvents);
        this.router.get('/event/:eventID', this.getEvent);
    }
}
exports.default = ApiController;
//# sourceMappingURL=api.controller.js.map