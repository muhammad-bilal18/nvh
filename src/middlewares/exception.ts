import winston from 'winston';
// import 'winston-mongodb';
import { Request, Response, NextFunction } from 'express';

const logger = winston.createLogger({
    level: 'silly',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({
            filename: 'error.log',
            level: 'warn'
        }),
        new winston.transports.Console({
            level: 'silly',
        }),
        // new winston.transports.MongoDB({
        //     db: 'mongodb://localhost/project',
        //     options: { useUnifiedTopology: true },
        //     level: 'error'
        // })
    ]
});

export function exception(ex: Error, _req: Request, res: Response, _next: NextFunction): void {
    logger.warn(ex.message);
    res.status(500).send({
        'msg': 'Internal server error. Please try again later.'
    });
}

export { logger };