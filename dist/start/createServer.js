"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createServer;
const express_1 = __importDefault(require("express"));
const patients_1 = __importDefault(require("../routes/patients"));
const appointments_1 = __importDefault(require("../routes/appointments"));
const exception_1 = require("../middlewares/exception");
const cors_1 = __importDefault(require("cors"));
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/api/patients', patients_1.default);
    app.use('/api/appointments', appointments_1.default);
    app.use(exception_1.exception);
    return app;
}
//# sourceMappingURL=createServer.js.map