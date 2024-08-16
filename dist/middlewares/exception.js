"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.exception = exception;
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'silly',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json(), winston_1.default.format.prettyPrint()),
    transports: [
        new winston_1.default.transports.File({
            filename: 'error.log',
            level: 'warn'
        }),
        new winston_1.default.transports.Console({
            level: 'silly',
        }),
    ]
});
exports.logger = logger;
function exception(ex, _req, res, _next) {
    logger.warn(ex.message);
    res.status(500).send({
        'msg': 'Internal server error. Please try again later.'
    });
}
//# sourceMappingURL=exception.js.map