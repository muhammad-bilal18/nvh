"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleExceptions;
const exception_1 = require("../middlewares/exception");
require("express-async-errors");
function handleExceptions() {
    process.on('uncaughtException', (ex) => {
        exception_1.logger.warn(ex.message);
        process.exit(1);
    });
    process.on('unhandledRejection', (ex) => {
        if (ex instanceof Error) {
            exception_1.logger.warn(ex.message);
        }
        else {
            exception_1.logger.warn('Unhandled Rejection: ' + ex);
        }
        process.exit(1);
    });
}
//# sourceMappingURL=logging.js.map