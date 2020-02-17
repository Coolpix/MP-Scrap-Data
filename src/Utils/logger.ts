import * as logger from 'winston';
const { combine, timestamp, label, prettyPrint } = logger.format;

export default class Logger {

    private logger = logger;

    constructor(defaultLevel: string = 'info') {
        this.logger.configure({
            level: defaultLevel,
            format: combine(
                label({ label: 'chatbot-api' }),
                timestamp(),
                prettyPrint()
            ),
            transports: [
                new this.logger.transports.Console(),
                new this.logger.transports.File({ filename: 'chatbot-api.log' }),
                new this.logger.transports.File({ filename: 'chatbot-api-error.log', level: 'error' }),
            ],
            exceptionHandlers: [
                new this.logger.transports.File({ filename: 'chatbot-api-exceptions.log' })
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