import { logger } from './middlewares/exception';
import connectToDb from './start/db';
import logging from './start/logging';
import createServer from './start/createServer';
import { prod } from './start/production';
import path from 'path';

logging();
connectToDb();

const app = createServer();
prod(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', (_req, res) => {
    res.render('index')
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
});