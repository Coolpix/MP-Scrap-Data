import { Request, Response } from 'express'
import Logger from "../Utils/logger";

export default (logger: Logger) => {
    return (req: Request, resp: Response, next: any) => {
        logger.info(`Request logged: ${req.method}, ${req.path}`);
        next()
    }
};