"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = void 0;
exports.savePatient = savePatient;
exports.saveAppointment = saveAppointment;
exports.getAppointmentObject = getAppointmentObject;
exports.getPatientObject = getPatientObject;
const mongoose_1 = __importDefault(require("mongoose"));
const setup_1 = require("../tests/setup");
let id = new mongoose_1.default.Types.ObjectId();
exports.id = id;
async function savePatient() {
    let newPatient = new setup_1.Patient({
        petName: 'Tom',
        petType: 'Cat',
        ownerName: 'Bilal',
        ownerAddress: 'Lahore',
        ownerPhone: '03051927417'
    });
    await newPatient.save();
    const id = newPatient._id;
    return id.toString();
}
async function saveAppointment() {
    const patientId = await savePatient();
    let newApp = new setup_1.Appointment({
        patient: {
            _id: patientId,
            petName: 'Tom',
            ownerPhoneNumber: '03051927417'
        },
        appointmentStartTime: '2024-08-24T07:30:00.000Z',
        appointmentEndTime: '2024-08-24T09:30:00.000Z',
        description: 'Blood pressure check',
        feeAmount: 100,
        feeStatus: 'Unpaid',
    });
    const _id = patientId.toString();
    return { newApp, _id };
}
function getAppointmentObject() {
    return {
        patientId: '111111111111111111111111',
        appointmentStartTime: '2024-08-24T07:30:00.000Z',
        appointmentEndTime: '2024-08-24T09:30:00.000Z',
        description: 'Blood pressure check',
        feeAmount: 100,
        feeStatus: 'Unpaid',
    };
}
function getPatientObject() {
    return {
        petName: 'Tom',
        petType: 'Cat',
        ownerName: 'Bilal',
        ownerAddress: 'Lahore',
        ownerPhone: '03051927417'
    };
}
//# sourceMappingURL=utilities.js.map