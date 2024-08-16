import express, { Request, Response, NextFunction } from 'express';
import { Patient, validatePatient } from '../models/patient';
import mongoose from 'mongoose';

const router = express.Router();

const messages = {
    added: 'Patient added successfully',
    updated: 'Patient updated successfully',
    deleted: 'Patient deleted successfully',
    notFound: 'Patient not found'
}

router.get('/', async (_req: Request, res: Response) => {
    const patients = await Patient.find().sort('name');
    res.status(200).json(patients);
});

router.post('/', async (req: Request, res: Response) => {
    const error = validatePatient(req.body);
    if (error) return res.status(400).send({ 'msg': error.details[0].message });

    const patient = new Patient({
        petName: req.body.petName,
        petType: req.body.petType,
        ownerName: req.body.ownerName,
        ownerAddress: req.body.ownerAddress,
        ownerPhone: req.body.ownerPhone
    });
    await patient.save();
    return res.status(200).send({ 'msg': messages.added, 'newPatient': patient });
});

router.put('/:id', async (req: Request, res: Response) => {
    const error = validatePatient(req.body);
    if (error) return res.status(400).send({ 'msg': error.details[0].message });

    const updatedPatient = await Patient.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                petName: req.body.petName,
                petType: req.body.petType,
                ownerName: req.body.ownerName,
                ownerAddress: req.body.ownerAddress,
                ownerPhone: req.body.ownerPhone,
            }
        },
        { new: true }
    );

    if (!updatedPatient) return res.status(404).send({ 'msg': messages.notFound });
    return res.status(200).send({ 'msg': messages.updated, 'updatedPatient': updatedPatient });
});

router.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ msg: 'Invalid ID' });
    const patient = await Patient.findByIdAndDelete({ _id: id });
    if (!patient) return res.status(404).send({ 'msg': messages.notFound });
    return res.status(200).send({ 'msg': messages.deleted, 'deletedPatient': patient });
});

export default router;