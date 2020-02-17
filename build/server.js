"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("./app"));
const bodyParser = tslib_1.__importStar(require("body-parser"));
const api_controller_1 = tslib_1.__importDefault(require("./controllers/api.controller"));
const scraper_controller_1 = tslib_1.__importDefault(require("./controllers/scraper.controller"));
const EventRepository_1 = require("./Repositories/EventRepository");
((eventRepository) => {
    const app = new app_1.default({
        port: 8080,
        controllers: [
            new api_controller_1.default(eventRepository),
            new scraper_controller_1.default(eventRepository)
        ],
        middleWares: [
            bodyParser.json(),
            bodyParser.urlencoded({ extended: true })
        ]
    });
    app.listen();
})(new EventRepository_1.EventRepository());
//https://github.com/aligoren/express-typescript-test
//# sourceMappingURL=server.js.map