"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appointment_1 = require("../../../models/appointment");
describe('validateAppointment', () => {
    it('should return an error object if the input appointment is invalid', () => {
        const appointment = {
            patientId: 'invalidPatientId',
            appointmentStartTime: '2024-08-24T07:30:00.000Z',
            appointmentEndTime: '2024-08-24T09:30:00.000Z',
            description: 'Blood pressure check',
            feeAmount: 100,
            feeStatus: 'Unpaid',
        };
        const error = (0, appointment_1.validateAppointment)(appointment);
        expect(error).toBeTruthy();
    });
    it('should return an error object if the input appointment is invalid', () => {
        const appointment = {
            patientId: '66b49e55b030d2ec7e8cd5fb',
            appointmentStartTime: '2024-08-24T07:30:00.000Z',
            appointmentEndTime: '2024-08-24T09:30:00.000Z',
            description: 'Blood pressure check',
            feeAmount: 100,
            feeStatus: 'Unpaid',
        };
        const error = (0, appointment_1.validateAppointment)(appointment);
        expect(error).toBe(undefined);
    });
});
//# sourceMappingURL=appointment.test.js.map