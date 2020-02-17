import puppeteer from 'puppeteer'
import moment from "moment"
import { Event } from '../Entities/event'

// export module Scraper {
export class Scraper {

    private domain: string

    private puppeteerConfig: object

    constructor(domain: string) {
        this.domain = domain
        this.puppeteerConfig = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        }
        moment.locale('es')
    }

    public scrapeEvents = async (): Promise<string[] | undefined> => {
        const url: string = this.domain + '/eventos.php'

        // Lanzamos puppeteer, abrimos nueva pagina y navegamos a la URL seleccionada.
        const browser = await puppeteer.launch(this.puppeteerConfig)
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2' })

        const data = await page.evaluate(() => {
            const listEventsSelector = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td > table > tbody'
            const eventsTable = document.querySelector(listEventsSelector)
            if (eventsTable) {
                const eventsPanel = Array.from(eventsTable.children)
                if (eventsPanel) {
                    const events = eventsPanel.map(tr => {
                        if (tr) {
                            const trs = tr.querySelector('tr *')
                            if (trs) {
                                const trsOnclick = trs.getAttribute('onclick')
                                return trsOnclick
                            }
                        }
                    })
                    return events
                }
            }
        })

        if (data) {
            const urlsActiveEvents: any[] = data.filter((link) => link !== null).map((link) => {
                if (link) {
                    return this.domain + '/' + link.split("'")[1]
                }
            })

            return urlsActiveEvents
        }

        // Cerramos navegador
        await browser.close()
    }

    public scrapeEvent = async (eventId: string): Promise<Event> => {
        const eventUrl = this.domain + "/eventos_detalle.php?id=" + eventId
        const loginUrl = "https://www.madridpatina.com/00_registro.php"

        const usernameInput = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > input'
        const passwordInput = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > input'
        const signInButton = 'body > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr:nth-child(3) > td > img'

        // Lanzamos puppeteer, abrimos nueva pagina y navegamos a la URL de login.
        const browser = await puppeteer.launch(this.puppeteerConfig)
        const page = await browser.newPage()
        await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 0 })

        // Hacemos login
        await page.type(usernameInput, '9833')
        await page.type(passwordInput, 'sergio29')
        await page.click(signInButton)

        // Vamos a la URL del evento
        await page.goto(eventUrl, { waitUntil: 'networkidle2', timeout: 0 })

        // Xpath
        const nameSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[1]/td/table/tbody/tr[2]/td/span'
        const imgSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[3]/table/tbody/tr[1]/td/table/tbody/tr[2]/td/table/tbody/tr[1]/td/div/img'
        const dateSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[1]/td/table/tbody/tr[1]/td[2]/span'
        const typeSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[1]/table/tbody/tr[2]/td/table/tbody/tr[4]/td/table/tbody/tr[2]/td[1]/table/tbody/tr[2]/td/span'
        const totalSpotsSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[1]/table/tbody/tr[2]/td/table/tbody/tr[4]/td/table/tbody/tr[8]/td[1]/table/tbody/tr[2]/td/span/ul/li[1]/span'
        const totalPeopleJoinedSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[3]/td[1]/table/tbody/tr[2]/td/table/tbody/tr[4]/td/table/tbody/tr[8]/td[1]/table/tbody/tr[2]/td/span/ul/li[2]'
        const altimetryImgSelector = '/html/body/table/tbody/tr/td/table/tbody/tr[4]/td[2]/table[1]/tbody/tr[7]/td[1]/table/tbody/tr[1]/td/table/tbody/tr[4]/td/img'

        // Nombre del evento
        const [nameElement] = await page.$x(nameSelector)
        const nameContent = await nameElement.getProperty('textContent')
        const nameJson: any = await nameContent.jsonValue()
        let name: string = ''
        if (nameJson) {
            name = nameJson.toString().trim()
        }

        // Imagen del evento
        const [imgElement] = await page.$x(imgSelector)
        const imgSrc = await imgElement.getProperty('src')
        const imgURL: any = await imgSrc.jsonValue()

        // Fecha del evento
        const [dateElement] = await page.$x(dateSelector)
        const dateContent = await dateElement.getProperty('textContent')
        const dateJson: any = await dateContent.jsonValue()
        let date: any = ''
        let month: any = ''
        let monthDigit: any = ''
        let unixTime: any = ''
        let textTimeToEvent: any = ''
        let hasEnded: boolean = false
        if (dateJson) {
            const arrayDate = dateJson.toString().trim().split("-")[1].trim().split(".")
            date = moment(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('dddd LL')
            month = moment(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('MMMM')
            monthDigit = moment(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('M')
            unixTime = moment(arrayDate[2] + arrayDate[1] + arrayDate[0]).format('X')
            textTimeToEvent = moment.unix(unixTime).fromNow();
            hasEnded = moment().format('X') > unixTime
        }

        // Tipo de evento
        const [typeElement] = await page.$x(typeSelector)
        const typeContent = await typeElement.getProperty('textContent')
        const type: any = await typeContent.jsonValue()

        // Plazas total del evento
        const [totalSpotsElement] = await page.$x(totalSpotsSelector)
        const totalSpotsContent = await totalSpotsElement.getProperty('textContent')
        const totalSpotsJson: any = await totalSpotsContent.jsonValue()
        let totalSpots: string = ''
        if (totalSpotsJson) {
            totalSpots = totalSpotsJson.toString().trim().split(" ")[0]
        }

        // Gente apuntada
        const [totalPeopleJoinedElement] = await page.$x(totalPeopleJoinedSelector)
        const totalPeopleJoinedContent = await totalPeopleJoinedElement.getProperty('textContent')
        const totalPeopleJoinedJson: any = await totalPeopleJoinedContent.jsonValue()
        let totalPeopleJoined: string = ''
        if (totalPeopleJoinedJson) {
            totalPeopleJoined = totalPeopleJoinedJson.toString().trim().split(" ")[0]
        }

        // Imagen de la altimetria
        const [imgAltimetry] = await page.$x(altimetryImgSelector)
        const imgAltimetrySrc = await imgAltimetry.getProperty('src')
        const imgAltimetryURL: any = await imgAltimetrySrc.jsonValue()

        // Asistentes al evento
        const usersJoined = await page.evaluate(() => {
            const listUsersSelector = '#mCSB_1 > div.mCSB_container > table > tbody'
            const usersTable = document.querySelector(listUsersSelector)

            if (usersTable) {
                const usersPanel = Array.from(usersTable.children)
                if (usersPanel) {
                    const usersInfo = usersPanel.map(tr => {
                        if (tr) {
                            const tds = tr.querySelectorAll('td *')
                            if (tds) {
                                const namesArray: any = []
                                const photosArray: any = []

                                Array.from(tds).map((td) => td.textContent).filter((td) => td !== '').map((userName) => namesArray.push(userName))
                                Array.from(tds).map((td) => td.getAttribute('src')).filter((td) => td !== null).map((photoUrl) => photosArray.push(photoUrl));

                                return { namesArray, photosArray }
                            }
                        }
                    })
                    return usersInfo
                }
            }
        })

        const infoUsers: any[] = []

        usersJoined?.forEach((element: any) => {
            element.namesArray.forEach((names: any, index: number) => {
                const user: any = {}
                user.userName = names
                user.photoUrl = this.domain + '/' + element.photosArray[index]
                infoUsers.push(user)
            })
        })

        // Cerramos navegador
        browser.close()

        const event = new Event(eventId, name, imgURL, month, monthDigit, date, unixTime, textTimeToEvent, hasEnded, type, totalSpots, totalPeopleJoined, imgAltimetryURL, infoUsers)

        return event
    }
}
// }
