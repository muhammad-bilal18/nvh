import request from 'supertest';
import { app, Patient, Appointment } from '../../setup';
import { id, savePatient, saveAppointment, getAppointmentObject } from '../../utilities';

describe('api/patients', () => {

    describe('GET /', () => {
        it('should return all appointments', async () => {

            const app1 = await saveAppointment();
            await app1.newApp.save();
            
            const app2 = await saveAppointment(); 
            await app2.newApp.save();

            const response = await request(app).get('/api/appointments');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);

            expect(response.body.some((a: { feeStatus: string; }) => a.feeStatus === app1.newApp.feeStatus)).toBeTruthy();
            expect(response.body.some((a: { feeAmount: number; }) => a.feeAmount === app2.newApp.feeAmount)).toBeTruthy();
        });
    });

    describe('GET /patient/:id', () => {
        it('should return 404 if patient does not exist in record', async () => {
            const response = await request(app).get(`/api/appointments/patient/${id}`);
            expect(response.statusCode).toBe(404);
        });

        it('should return all appointments of a patient', async () => {
            const { newApp, _id } = await saveAppointment();
            await newApp.save();
            const response = await request(app).get(`/api/appointments/patient/${_id}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
        });
        
        it('should return empty array if records does not exist', async () => {
            const patient = await savePatient();
            const response = await request(app).get(`/api/appointments/patient/${patient}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(0);
        });
    });

    describe('GET /patient/:id/unpaid-fees', () => {
        it('should return 404 if patient does not exist in record', async () => {
            const response = await request(app).get(`/api/appointments/patient/${id}/unpaid-fees`);
            expect(response.statusCode).toBe(404);
        });
        
        it('should return total unpaid amount if patient exists', async () => {
            const { newApp, _id } = await saveAppointment();
            newApp.feeStatus = 'Unpaid';
            newApp.feeAmount = 100;
            await newApp.save();
            const response = await request(app).get(`/api/appointments/patient/${_id}/unpaid-fees`);
            expect(response.statusCode).toBe(200);
            expect(response.body.unpaidAmount).toBe(100);
        });
    });

    describe('GET /:feeStatus', () => {
        it('should return 200 & all appointments of given feeStatus', async () => {
            const app1 = await saveAppointment();
            app1.newApp.feeStatus = 'Unpaid'; 
            await app1.newApp.save();
            
            const app2 = await saveAppointment();
            app2.newApp.feeStatus = 'Unpaid'; 
            await app2.newApp.save();

            const response = await request(app).get(`/api/appointments/Unpaid`);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        })
        
        it('should return 404 if no records with given feeStatus exist', async () => {
            const response = await request(app).get(`/api/appointments/Unpaid`);

            expect(response.statusCode).toBe(404);
        })
    })

    describe('GET /:feeStatus', () => {
        const date = new Date();
        it('should return 200 & all appointments of given date', async () => {

            const app1 = await saveAppointment();
            app1.newApp.appointmentStartTime = date;
            app1.newApp.appointmentEndTime = date;
            await app1.newApp.save();
            
            const app2 = await saveAppointment();
            app2.newApp.appointmentStartTime = date;
            app2.newApp.appointmentEndTime = date;
            await app2.newApp.save();

            const response = await request(app).get(`/api/appointments/day/${date}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        })
        
        it('should return 404 if no records with given date exist', async () => {
            const response = await request(app).get(`/api/appointments/day/${date}`);

            expect(response.statusCode).toBe(404);
        })
    })

    describe('POST /', () => {
        
        let newApp = getAppointmentObject();
        it('should add new appointment to db and return status 200 if appointment is valid and patient exist', async () => {
            const pId = await savePatient();
            newApp.patientId = pId;
            const response = await request(app).post('/api/appointments').send(newApp);
            expect(response.statusCode).toBe(200);
        });
        
        it('should return status 400 if the input is invalid', async () => {
            newApp.feeStatus = '';
            const response = await request(app).post('/api/appointments').send(newApp);
            expect(response.statusCode).toBe(400);
        });
        
        it('should return status 404 if the patient does not exist', async () => {
            newApp.feeStatus = 'USD';
            const response = await request(app).post('/api/appointments').send(newApp);
            expect(response.statusCode).toBe(404);
        });
    });

    describe('DELETE /:id', () => {
        it('should delete the appointment if the ID is valid and record exists', async () => {

            const { newApp } = await saveAppointment();
            await newApp.save();
            const response = await request(app).delete(`/api/appointments/${newApp._id}`);
   
            expect(response.statusCode).toBe(200);
            const deletedPatient = await Patient.findById(newApp._id);
            expect(deletedPatient).toBeNull();
        });

        it('should return 404 if the patient with given ID does not exist', async () => {
            const response = await request(app).delete(`/api/appointments/${id}`);
            expect(response.statusCode).toBe(404);
        });
        
        it('should return 400 if the patient ID is invalid', async () => {
            const response = await request(app).delete(`/api/patients/invalidId`);
            expect(response.statusCode).toBe(400);
            expect(response.body.msg).toBe('Invalid ID');
        });
    })

    describe('PUT /:id', () => {

        async function execute() {
            return await request(app)
            .put(`/api/appointments/${id}`)
            .send(appointment);
        }

        let appointment = getAppointmentObject();

        it('should return 404 if the record does not exist', async () => {
            const response = await execute();
            expect(response.statusCode).toBe(404);
        });

        it('should return 400 if the input data is invalid', async () => {
            appointment.feeStatus = '';
            const response = await execute();
            expect(response.statusCode).toBe(400);
        });

        it('should update the patient if the ID and data are valid and record exists', async () => {
            const { newApp, _id } = await saveAppointment();
            newApp.feeStatus = 'Unpaid';
            newApp.save();

            appointment.patientId = _id;
            appointment.feeStatus = 'USD';
    
            const response = await request(app)
                .put(`/api/appointments/${newApp._id}`)
                .send(appointment);
    
            expect(response.statusCode).toBe(200);

            const patientInDb = await Appointment.findById(newApp._id);
            expect(patientInDb).toHaveProperty('feeStatus', 'USD');
        });
    })

});