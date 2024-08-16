"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patient_1 = require("../../../models/patient");
describe('validatePatient', () => {
    it('should return an error object if the input patient is invalid', () => {
        const patient = {
            petName: 'Tom',
            petType: 'Lion',
            ownerName: 'Bilal',
            ownerAddress: 'Lahore',
            ownerPhone: '03051927417'
        };
        const error = (0, patient_1.validatePatient)(patient);
        expect(error).toBeTruthy();
    });
    it('should return an error object if the input patient is invalid', () => {
        const patient = {
            petName: 'Tom',
            petType: 'Cat',
            ownerName: 'Bilal',
            ownerAddress: 'Lahore',
            ownerPhone: '03051927417'
        };
        const error = (0, patient_1.validatePatient)(patient);
        expect(error).toBe(undefined);
    });
});
//# sourceMappingURL=patient.test.js.map