"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const exception_1 = require("../middlewares/exception");
const config_1 = __importDefault(require("config"));
function connectToDatabase() {
    const url = config_1.default.get('db') || 'mongodb://localhost/hospital';
    mongoose_1.default.connect(url)
        .then(() => {
        exception_1.logger.info(`Connected to ${url}`);
    })
        .catch((error) => {
        exception_1.logger.warn(`Failed to connect to the database. Error: ${error.message}`);
    });
}
//# sourceMappingURL=db.js.map