"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const setup_1 = require("../../setup");
const utilities_1 = require("../../utilities");
describe('api/patients', () => {
    describe('GET /', () => {
        it('should return all patients', async () => {
            await setup_1.Patient.collection.insertMany([
                { petName: 'pet1', petType: 'type1', ownerName: 'owner1', ownerAddress: 'address1', ownerPhone: 'phone1' },
                { petName: 'pet2', petType: 'type2', ownerName: 'owner2', ownerAddress: 'address2', ownerPhone: 'phone2' }
            ]);
            const response = await (0, supertest_1.default)(setup_1.app).get('/api/patients');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some((p) => p.petName === 'pet1')).toBeTruthy();
            expect(response.body.some((p) => p.petName === 'pet2')).toBeTruthy();
        });
    });
    describe('POST /', () => {
        let newPatient = (0, utilities_1.getPatientObject)();
        it('should add new patient to db return status 200', async () => {
            const response = await (0, supertest_1.default)(setup_1.app).post('/api/patients').send(newPatient);
            const patientInDb = await setup_1.Patient.findOne(newPatient);
            expect(patientInDb).toBeTruthy();
            expect(response.statusCode).toBe(200);
        });
        it('should return status 400 if the input in invalid', async () => {
            newPatient.petType = 'Lion';
            const response = await (0, supertest_1.default)(setup_1.app).post('/api/patients').send(newPatient);
            expect(response.statusCode).toBe(400);
        });
    });
    describe('DELETE /:id', () => {
        it('should delete the patient if the ID is valid and patient exists', async () => {
            const _id = await (0, utilities_1.savePatient)();
            const response = await (0, supertest_1.default)(setup_1.app).delete(`/api/patients/${_id}`);
            expect(response.statusCode).toBe(200);
            const deletedPatient = await setup_1.Patient.findById(_id);
            expect(deletedPatient).toBeNull();
        });
        it('should return 404 if the patient with given ID does not exist', async () => {
            const response = await (0, supertest_1.default)(setup_1.app).delete(`/api/patients/${utilities_1.id}`);
            expect(response.statusCode).toBe(404);
            expect(response.body.msg).toBe('Patient not found');
        });
        it('should return 400 if the patient ID is invalid', async () => {
            const response = await (0, supertest_1.default)(setup_1.app).delete(`/api/patients/invalidId`);
            expect(response.statusCode).toBe(400);
            expect(response.body.msg).toBe('Invalid ID');
        });
    });
    describe('PUT /:id', () => {
        let newPatient = (0, utilities_1.getPatientObject)();
        it('should return 404 if the patient does not exist', async () => {
            const response = await (0, supertest_1.default)(setup_1.app)
                .put(`/api/patients/${utilities_1.id}`)
                .send(newPatient);
            expect(response.statusCode).toBe(404);
        });
        it('should return 400 if the input data is invalid', async () => {
            newPatient.petName = '';
            const response = await (0, supertest_1.default)(setup_1.app)
                .put(`/api/patients/${utilities_1.id}`)
                .send(newPatient);
            expect(response.statusCode).toBe(400);
        });
        it('should update the patient if the ID and data are valid', async () => {
            const _id = await (0, utilities_1.savePatient)();
            newPatient.petName = 'Thomas';
            const response = await (0, supertest_1.default)(setup_1.app)
                .put(`/api/patients/${_id}`)
                .send(newPatient);
            expect(response.statusCode).toBe(200);
            const patientInDb = await setup_1.Patient.findById(_id);
            expect(patientInDb).toHaveProperty('petName', 'Thomas');
        });
    });
});
//# sourceMappingURL=patients.test.js.map