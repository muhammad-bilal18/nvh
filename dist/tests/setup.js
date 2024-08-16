"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = exports.Patient = exports.app = void 0;
const db_1 = __importDefault(require("../start/db"));
const createServer_1 = __importDefault(require("../start/createServer"));
const mongoose_1 = __importDefault(require("mongoose"));
const patient_1 = require("../models/patient");
Object.defineProperty(exports, "Patient", { enumerable: true, get: function () { return patient_1.Patient; } });
const appointment_1 = require("../models/appointment");
Object.defineProperty(exports, "Appointment", { enumerable: true, get: function () { return appointment_1.Appointment; } });
let app;
let server;
beforeAll(() => {
    (0, db_1.default)();
    exports.app = app = (0, createServer_1.default)();
    server = app.listen(3000, () => {
        console.log('test server is listening');
    });
});
afterEach(async () => {
    await patient_1.Patient.deleteMany({});
    await appointment_1.Appointment.deleteMany({});
});
afterAll(async () => {
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    server.close();
});
//# sourceMappingURL=setup.js.map