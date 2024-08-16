"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("./middlewares/exception");
const db_1 = __importDefault(require("./start/db"));
const logging_1 = __importDefault(require("./start/logging"));
const createServer_1 = __importDefault(require("./start/createServer"));
const production_1 = require("./start/production");
(0, logging_1.default)();
console.log('app.ts');
(0, db_1.default)();
const app = (0, createServer_1.default)();
(0, production_1.prod)(app);
app.use('/', (_req, res) => {
    res.send('hello world');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    exception_1.logger.info(`Server listening on port ${port}`);
});
//# sourceMappingURL=app.js.map