import { logger } from '../middlewares/exception';
import 'express-async-errors';

export default function handleExceptions(): void {

    process.on('uncaughtException', (ex: Error) => {
        logger.warn(ex.message);
        process.exit(1);
    });

    process.on('unhandledRejection', (ex: any) => {
        if (ex instanceof Error) {
            logger.warn(ex.message);
        } else {
            logger.warn('Unhandled Rejection: ' + ex);
        }
        process.exit(1);
    });
}