"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const Font = require('ascii-art-font');
class App {
    constructor(appInit) {
        this.app = express_1.default();
        this.port = appInit.port;
        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
    }
    middlewares(middleWares) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }
    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            Font.create('Madridpatina    Scraper', "Doom", (err, rendered) => {
                console.log(rendered);
                console.log(`App listening on the http://localhost:${this.port}`);
            });
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map