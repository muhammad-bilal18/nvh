import express, { Express } from 'express';
import patients from '../routes/patients';
import appointments from '../routes/appointments';
import { exception } from '../middlewares/exception';
import cors from 'cors';

export default function createServer(): Express {

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/patients', patients);
    app.use('/api/appointments', appointments);

    app.use(exception);

    return app;
}