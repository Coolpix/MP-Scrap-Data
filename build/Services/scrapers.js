"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = tslib_1.__importDefault(require("puppeteer"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const event_1 = require("../Entities/event");
//export module Scraper {
class Scraper {
    constructor(domain) {
        this.scrapeEvents = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const url = this.domain + '/eventos.php';
            //Lanzamos puppeteer, abrimos nueva pagina y navegamos a la URL seleccionada.
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto(url, { waitUntil: 'networkidle2' });
            const data = yield page.evaluate(() => {
                const listEventsSelector = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td > table > tbody';
                const eventsTable = document.querySelector(listEventsSelector);
                if (eventsTable) {
                    const events_panel = Array.from(eventsTable.children);
                    if (events_panel) {
                        const events = events_panel.map(tr => {
                            if (tr) {
                                const trs = tr.querySelector('tr *');
                                if (trs) {
                                    const trs_onclick = trs.getAttribute('onclick');
                                    return trs_onclick;
                                }
                            }
                        });
                        return events;
                    }
                }
            });
            if (data) {
                const urlsActiveEvents = data.filter((link) => link !== null).map((link) => {
                    if (link) {
                        return this.domain + '/' + link.split("'")[1];
                    }
                });
                return urlsActiveEvents;
            }
            //Cerramos navegador
            yield browser.close();
        });
        this.scrapeEvent = (eventId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a;
            const event_url = this.domain + "/eventos_detalle.php?id=" + eventId;
            const login_url = "https://www.madridpatina.com/00_registro.php";
            const username_input = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > input';
            const password_input = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > input';
            const sign_in_button = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(3) > td > img';
            //Lanzamos puppeteer, abrimos nueva pagina y navegamos a la URL de login.
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto(login_url, { waitUntil: 'networkidle2', timeout: 0 });
            //Hacemos login
            yield page.type(username_input, '9833');
            yield page.type(password_input, 'sergio29');
            yield page.click(sign_in_button);
            //Vamos a la URL del evento
            yield page.goto(event_url, { waitUntil: 'networkidle2', timeout: 0 });
            //Xpath
            const nameSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[1]/td/table/tbody/tr[2]/td/span';
            const imgSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[3]/table/tbody/tr[1]/td/table/tbody/tr[2]/td/table/tbody/tr[1]/td/div/img';
            const dateSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[1]/td/table/tbody/tr[1]/td[2]/span';
            const typeSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[1]/table/tbody/tr[2]/td/table/tbody/tr[4]/td/table/tbody/tr[2]/td[1]/table/tbody/tr[2]/td/span';
            const totalSpotsSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[1]/table/tbody/tr[2]/td/table/tbody/tr[4]/td/table/tbody/tr[8]/td[1]/table/tbody/tr[2]/td/span/ul/li[1]/span';
            const totalPeopleJoinedSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[1]/table/tbody/tr[2]/td/table/tbody/tr[4]/td/table/tbody/tr[8]/td[1]/table/tbody/tr[2]/td/span/ul/li[2]';
            const altimetryImgSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[7]/td[1]/table/tbody/tr[1]/td/table/tbody/tr[4]/td/img';
            //Nombre del evento
            const [nameElement] = yield page.$x(nameSelector);
            const nameContent = yield nameElement.getProperty('textContent');
            const nameJson = yield nameContent.jsonValue();
            let name = '';
            if (nameJson) {
                name = nameJson.toString().trim();
            }
            //Imagen del evento
            const [imgElement] = yield page.$x(imgSelector);
            const imgSrc = yield imgElement.getProperty('src');
            const imgURL = yield imgSrc.jsonValue();
            //Fecha del evento
            const [dateElement] = yield page.$x(dateSelector);
            const dateContent = yield dateElement.getProperty('textContent');
            const dateJson = yield dateContent.jsonValue();
            let date = '';
            let month = '';
            let monthDigit = '';
            let unixTime = '';
            let textTimeToEvent = '';
            let hasEnded = false;
            if (dateJson) {
                const arrayDate = dateJson.toString().trim().split("-")[1].trim().split(".");
                date = moment_1.default(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('dddd LL');
                month = moment_1.default(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('MMMM');
                monthDigit = moment_1.default(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('M');
                unixTime = moment_1.default(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('X');
                textTimeToEvent = moment_1.default.unix(unixTime).fromNow();
                hasEnded = moment_1.default().format('X') > unixTime;
            }
            //Tipo de evento
            const [typeElement] = yield page.$x(typeSelector);
            const typeContent = yield typeElement.getProperty('textContent');
            const type = yield typeContent.jsonValue();
            //Plazas total del evento
            const [totalSpotsElement] = yield page.$x(totalSpotsSelector);
            const totalSpotsContent = yield totalSpotsElement.getProperty('textContent');
            const totalSpotsJson = yield totalSpotsContent.jsonValue();
            let totalSpots = '';
            if (totalSpotsJson) {
                totalSpots = totalSpotsJson.toString().trim().split(" ")[0];
            }
            //Gente apuntada
            const [totalPeopleJoinedElement] = yield page.$x(totalPeopleJoinedSelector);
            const totalPeopleJoinedContent = yield totalPeopleJoinedElement.getProperty('textContent');
            const totalPeopleJoinedJson = yield totalPeopleJoinedContent.jsonValue();
            let totalPeopleJoined = '';
            if (totalPeopleJoinedJson) {
                totalPeopleJoined = totalPeopleJoinedJson.toString().trim().split(" ")[0];
            }
            //Imagen de la altimetria
            const [imgAltimetry] = yield page.$x(altimetryImgSelector);
            const imgAltimetrySrc = yield imgAltimetry.getProperty('src');
            const imgAltimetryURL = yield imgAltimetrySrc.jsonValue();
            //Asistentes al evento
            const usersJoined = yield page.evaluate(() => {
                const listUsersSelector = '#mCSB_1 > div.mCSB_container > table > tbody';
                const usersTable = document.querySelector(listUsersSelector);
                if (usersTable) {
                    const users_panel = Array.from(usersTable.children);
                    if (users_panel) {
                        const usersInfo = users_panel.map(tr => {
                            if (tr) {
                                const tds = tr.querySelectorAll('td *');
                                if (tds) {
                                    const namesArray = [];
                                    const photosArray = [];
                                    Array.from(tds).map((td) => td.textContent).filter((td) => td !== '').map((name) => namesArray.push(name));
                                    Array.from(tds).map((td) => td.getAttribute('src')).filter((td) => td !== null).map((photoUrl) => photosArray.push(photoUrl));
                                    return { namesArray, photosArray };
                                }
                            }
                        });
                        return usersInfo;
                    }
                }
            });
            const infoUsers = [];
            (_a = usersJoined) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
                element.namesArray.forEach((names, index) => {
                    const user = {};
                    user.userName = names;
                    user.photoUrl = this.domain + '/' + element.photosArray[index];
                    infoUsers.push(user);
                });
            });
            //Cerramos navegador
            browser.close();
            const event = new event_1.Event(eventId, name, imgURL, month, monthDigit, date, unixTime, textTimeToEvent, hasEnded, type, totalSpots, totalPeopleJoined, imgAltimetryURL, infoUsers);
            return event;
        });
        this.domain = domain;
        moment_1.default.locale('es');
    }
}
exports.Scraper = Scraper;
//}
//# sourceMappingURL=scrapers.js.map