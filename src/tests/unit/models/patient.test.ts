import { validatePatient } from "../../../models/patient";

describe('validatePatient', () => {
    it('should return an error object if the input patient is invalid', () => {
        const patient = {
            petName: 'Tom',
            petType: 'Lion', // invalid petType
            ownerName: 'Bilal',
            ownerAddress: 'Lahore',
            ownerPhone: '03051927417'
        }
        const error = validatePatient(patient);
        expect(error).toBeTruthy();
    });
    
    it('should return an error object if the input patient is invalid', () => {
        const patient = {
            petName: 'Tom',
            petType: 'Cat',
            ownerName: 'Bilal',
            ownerAddress: 'Lahore',
            ownerPhone: '03051927417'
        }
        const error = validatePatient(patient);
        expect(error).toBe(undefined);
    });
});