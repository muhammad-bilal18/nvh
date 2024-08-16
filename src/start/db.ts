import mongoose from 'mongoose';
import { logger } from '../middlewares/exception';
import config from 'config';

export default function connectToDatabase(): void {
    const url: string =  config.get<string>('db') || 'mongodb://localhost/hospital';
    
    mongoose.connect(url)
        .then(() => {
            logger.info(`Connected to ${url}`);
        })
        .catch((error) => {
            logger.warn(`Failed to connect to the database. Error: ${error.message}`);
        });
}