"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRoutes;
const patients_1 = __importDefault(require("../routes/patients"));
const appointments_1 = __importDefault(require("../routes/appointments"));
const exception_1 = require("../middlewares/exception");
function setupRoutes(app) {
    app.use('/api/patients', patients_1.default);
    app.use('/api/appointments', appointments_1.default);
    app.use(exception_1.exception);
}
//# sourceMappingURL=routes.js.map