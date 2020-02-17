"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = tslib_1.__importStar(require("express"));
const scrapers_1 = require("../Services/scrapers");
class ScraperController {
    constructor(eventRepository) {
        this.path = '/';
        this.router = express.Router();
        this.scrapeEvents = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const urlsActiveEvents = yield this.scraper.scrapeEvents();
            if (urlsActiveEvents) {
                const events = urlsActiveEvents.map((link) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const eventId = link.split("=")[1];
                    const event = yield this.eventRepository.getEvent(eventId);
                    console.log(`Encontrado evento ${eventId}`);
                    const eventData = yield this.scraper.scrapeEvent(eventId);
                    if (eventData.hasEnded && ((_a = event) === null || _a === void 0 ? void 0 : _a.hasEnded) === true) {
                        return {
                            "message": `El evento ${eventId} ya ha acabado, no se actualiza`
                        };
                    }
                    return event ? yield this.eventRepository.updateEvent(eventId, eventData) : yield this.eventRepository.createEvent(eventData);
                }));
                if (events.length > 0) {
                    Promise.all(events).then((data) => {
                        res.send(data);
                    });
                }
            }
        });
        this.forceScrape = (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const eventId = req.params.eventID;
            console.log(`Forzando el scrapping del evento ${eventId}`);
            const event = yield this.eventRepository.getEvent(eventId);
            const eventData = yield this.scraper.scrapeEvent(eventId);
            const eventInfo = event ? yield this.eventRepository.updateEvent(eventId, eventData) : yield this.eventRepository.createEvent(eventData);
            res.send(eventInfo);
        });
        this.initRoutes();
        this.eventRepository = eventRepository;
        this.scraper = new scrapers_1.Scraper("http://www.madridpatina.com");
    }
    initRoutes() {
        this.router.get('/scrape_events', this.scrapeEvents);
        this.router.get('/force_event/:eventID', this.forceScrape);
    }
}
exports.default = ScraperController;
//# sourceMappingURL=scraper.controller.js.map