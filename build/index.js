"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
require("reflect-metadata");
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const scrapers_1 = require("./src/scrapers");
const EventRepository_1 = require("./src/Repositories/EventRepository");
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const port = 3000;
    const scrapper = new scrapers_1.Scraper("http://www.madridpatina.com");
    const eventRepository = new EventRepository_1.EventRepository();
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true })); // support encoded bodies
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*"); //disabled for security on local
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    });
    app.get('/events', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const events = yield eventRepository.getEvents();
        const allEvents = [];
        events.forEach((doc) => {
            allEvents.push(doc.data());
        });
        res.send(allEvents);
    }));
    app.get('/scrape_events', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const urlsActiveEvents = yield scrapper.scrapeEvents();
        if (urlsActiveEvents) {
            const events = urlsActiveEvents.map((link) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const eventId = link.split("=")[1];
                const event = yield eventRepository.getEvent(eventId);
                console.log(`Encontrado evento ${eventId}`);
                const eventData = yield scrapper.scrapeEvent(eventId);
                return event ? yield eventRepository.updateEvent(eventId, eventData) : yield eventRepository.createEvent(eventData);
            }));
            if (events.length > 0) {
                Promise.all(events).then((data) => {
                    res.send(data);
                });
            }
        }
    }));
    app.post('/forceEvent', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const eventId = req.body.eventId;
        console.log(`Forzando el scrapping del evento ${eventId}`);
        if (eventId) {
            const event = yield eventRepository.getEvent(eventId);
            const eventData = yield scrapper.scrapeEvent(eventId);
            const eventInfo = event ? yield eventRepository.updateEvent(eventId, eventData) : yield eventRepository.createEvent(eventData);
            res.send(eventInfo);
        }
    }));
    app.listen(port, function () {
        console.log(`Example app listening on port ${port}`);
    });
}))();
