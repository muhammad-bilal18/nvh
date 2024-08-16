import connectToDatabase from "../start/db";
import createServer from "../start/createServer";
import { Express } from "express";
import { Server } from 'http';
import mongoose from "mongoose";
import { Patient } from "../models/patient";
import { Appointment } from "../models/appointment";

let app: Express;
let server: Server;

beforeAll(() => {
    connectToDatabase();
    app = createServer();
    server = app.listen(3000, () => {
        console.log('test server is listening');
    })
});

afterEach(async() => {
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
})

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
})

export { app, Patient, Appointment };