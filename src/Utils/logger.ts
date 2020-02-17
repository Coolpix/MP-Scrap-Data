import * as logger from 'winston';
const { combine, timestamp, label, prettyPrint } = logger.format;

export default class Logger {

    private logger = logger;

    constructor(defaultLevel: string = 'info') {
        this.logger.configure({
            level: defaultLevel,
            format: combine(
                label({ label: 'mp-scraper' }),
                timestamp(),
                prettyPrint()
            ),
            transports: [
                new this.logger.transports.Console(),
                new this.logger.transports.File({ filename: 'mp-scraper.log' }),
                new this.logger.transports.File({ filename: 'mp-scraper-error.log', level: 'error' }),
            ],
            exceptionHandlers: [
                new this.logger.transports.File({ filename: 'mp-scraper-exceptions.log' })
            ]
        });
    }

    public log = (level: string, message: string) => {
        this.logger.log(level, message);
    };

    public info = (message: string) => {
        this.logger.info(message);
    };

    public warn = (message: string) => {
        this.logger.warn(message);
    };

    public error = (message: string) => {
        this.logger.error(message);
    };
}