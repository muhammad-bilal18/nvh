"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
exports.validateAppointment = validateAppointment;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
const appointmentSchema = new mongoose_1.Schema({
    patient: {
        type: new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
            petName: { type: String, required: true },
            ownerPhoneNumber: { type: String, required: true }
        }),
        required: true
    },
    appointmentStartTime: { type: Date, required: true },
    appointmentEndTime: { type: Date, required: true },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    feeAmount: { type: Number, required: true },
    feeStatus: {
        type: String,
        enum: ['USD', 'EUR', 'Bitcoin', 'Unpaid'],
        required: true
    }
});
const Appointment = mongoose_1.default.model('Appointment', appointmentSchema);
exports.Appointment = Appointment;
function validateAppointment(appointment) {
    const schema = joi_1.default.object({
        patientId: joi_1.default.string().length(24).required(),
        appointmentStartTime: joi_1.default.date().iso().required(),
        appointmentEndTime: joi_1.default.date().iso().required(),
        description: joi_1.default.string().min(5).max(255).required(),
        feeAmount: joi_1.default.number().required(),
        feeStatus: joi_1.default.string().valid('USD', 'EUR', 'Bitcoin', 'Unpaid').required()
    });
    return schema.validate(appointment).error;
}
//# sourceMappingURL=appointment.js.map