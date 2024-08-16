"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_1 = require("../models/appointment");
const patient_1 = require("../models/patient");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const messages = {
    added: 'Appointment added successfully',
    updated: 'Appointment updated successfully',
    deleted: 'Appointment deleted successfully',
    notFound: 'Patient not found',
    noRecord: 'Record not found'
};
router.get('/', async (_req, res) => {
    const appointments = await appointment_1.Appointment
        .find()
        .sort('appointmentStartTime');
    res.status(200).send(appointments);
});
router.get('/patient/:id', async (req, res) => {
    const id = req.params.id;
    const patient = await patient_1.Patient.findById(id);
    if (!patient)
        return res.status(404).send(messages.notFound);
    const appointments = await appointment_1.Appointment
        .find({ 'patient._id': id })
        .sort('appointmentStartTime');
    return res.status(200).send(appointments);
});
router.get('/patient/:id/unpaid-fees', async (req, res) => {
    const id = req.params.id;
    const patient = await patient_1.Patient.findById(id);
    if (!patient)
        return res.status(404).send(messages.notFound);
    const unpaidAppointments = await appointment_1.Appointment.find({
        "patient._id": req.params.id,
        feeStatus: "Unpaid"
    });
    const unpaidAmount = unpaidAppointments.reduce((sum, curr) => sum + curr.feeAmount, 0);
    return res.status(200).send({
        unpaidAmount
    });
});
router.get('/:feeStatus', async (req, res) => {
    const appointments = await appointment_1.Appointment
        .find({ feeStatus: req.params.feeStatus })
        .sort('appointmentStartTime');
    if (appointments.length === 0)
        return res.status(404).send(messages.noRecord);
    return res.status(200).send(appointments);
});
router.get('/day/:date', async (req, res) => {
    const startDate = new Date(req.params.date);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const appointments = await appointment_1.Appointment.find({
        appointmentStartTime: {
            $gte: startDate,
            $lt: endDate
        }
    }).sort('appointmentStartTime');
    if (appointments.length === 0)
        return res.status(404).send(messages.noRecord);
    return res.status(200).send(appointments);
});
router.get('/records/patients', async (_req, res) => {
    const results = await appointment_1.Appointment.aggregate([
        {
            $group: {
                _id: '$patient.petName',
                totalRevenue: { $sum: '$feeAmount' },
                appointmentCount: { $sum: 1 }
            }
        },
        {
            $sort: { appointmentCount: -1 }
        }
    ]);
    if (results.length === 0) {
        return res.status(404).send({ msg: messages.noRecord });
    }
    const mostPopularPet = results[0];
    return res.status(200).send({
        mostPopularPet: mostPopularPet._id,
        totalRevenue: mostPopularPet.totalRevenue,
        appointmentCount: mostPopularPet.appointmentCount,
        allPets: results
    });
});
router.post('/', async (req, res) => {
    const error = (0, appointment_1.validateAppointment)(req.body);
    if (error)
        return res.status(400).send({ msg: error.details[0].message });
    const patient = await patient_1.Patient.findById(req.body.patientId);
    if (!patient)
        return res.status(404).send({ msg: messages.notFound });
    const appointment = new appointment_1.Appointment({
        patient: {
            _id: patient._id,
            ownerPhoneNumber: patient.ownerPhone,
            petName: patient.petName
        },
        appointmentStartTime: req.body.appointmentStartTime,
        appointmentEndTime: req.body.appointmentEndTime,
        description: req.body.description,
        feeAmount: req.body.feeAmount,
        feeStatus: req.body.feeStatus
    });
    await appointment.save();
    return res.status(200).send({ msg: messages.added, newAppointment: appointment });
});
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).send({ msg: 'Invalid ID' });
    const appointment = await appointment_1.Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
        return res.status(404).send({ msg: `Record not found` });
    return res.status(200).send({ msg: messages.deleted, deletedAppointment: appointment });
});
router.put('/:id', async (req, res) => {
    const error = (0, appointment_1.validateAppointment)(req.body);
    if (error)
        return res.status(400).send({ msg: error.details[0].message });
    const updatedAppointment = await appointment_1.Appointment.findOneAndUpdate({ _id: req.params.id, 'patient._id': req.body.patientId }, {
        $set: {
            appointmentStartTime: req.body.appointmentStartTime,
            appointmentEndTime: req.body.appointmentEndTime,
            description: req.body.description,
            feeAmount: req.body.feeAmount,
            feeStatus: req.body.feeStatus
        }
    }, { new: true });
    if (!updatedAppointment)
        return res.status(404).send({ msg: messages.noRecord });
    return res.status(200).send({ msg: messages.updated, updatedAppointment });
});
router.get('/reports/month', async (_req, res) => {
    const monthlyReport = await appointment_1.Appointment.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: [{ $month: "$appointmentStartTime" }, { $month: new Date() }] },
                        { $eq: [{ $year: "$appointmentStartTime" }, { $year: new Date() }] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                totalPaid: {
                    $sum: {
                        $cond: [{ $in: ["$feeStatus", ['USD', 'EUR', 'Bitcoin']] }, "$feeAmount", 0]
                    }
                },
                totalUnpaid: {
                    $sum: {
                        $cond: [{ $eq: ["$feeStatus", "Unpaid"] }, "$feeAmount", 0]
                    }
                },
                totalBalance: { $sum: "$feeAmount" }
            }
        },
        {
            $project: {
                _id: 0,
                monthName: {
                    $concat: [
                        { $arrayElemAt: [
                                ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                                { $subtract: [{ $month: new Date() }, 1] }
                            ] },
                        " ",
                        { $toString: { $year: new Date() } }
                    ]
                },
                totalPaid: 1,
                totalUnpaid: 1,
                totalBalance: 1
            }
        }
    ]);
    res.status(200).send(monthlyReport);
});
exports.default = router;
//# sourceMappingURL=appointments.js.map