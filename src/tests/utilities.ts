import mongoose from 'mongoose';
import {  Patient, Appointment } from '../tests/setup';

let id = new mongoose.Types.ObjectId();

async function savePatient() {
    let newPatient = new Patient({
        petName: 'Tom',
        petType: 'Cat',
        ownerName: 'Bilal',
        ownerAddress: 'Lahore',
        ownerPhone: '03051927417'
    });
    await newPatient.save();
    const id:mongoose.Types.ObjectId = newPatient._id as mongoose.Types.ObjectId;
    return id.toString();
}

async function saveAppointment() {
    const patientId = await savePatient();
    let newApp = new Appointment({
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

export { id, savePatient, saveAppointment, getAppointmentObject, getPatientObject };