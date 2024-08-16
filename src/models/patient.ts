import Joi, { ValidationError } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

interface IPatient extends Document {
    petName: string;
    petType: 'Cat' | 'Dog' | 'Bird';
    ownerName: string;
    ownerAddress: string;
    ownerPhone: string;
}

const patientSchema = new Schema<IPatient>({
    petName: {
        type: String,
        required: true,
        minlength: 3
    },
    petType: {
        type: String,
        enum: ['Cat', 'Dog', 'Bird'],
        required: true
    },
    ownerName: {
        type: String,
        required: true,
        minlength: 4
    },
    ownerAddress: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true,
        length: 11
    }
});

const Patient = mongoose.model<IPatient>('Patient', patientSchema);

function validatePatient(patient: any) {
    const schema = Joi.object({
        petName: Joi.string().min(3).required(),
        petType: Joi.string().valid('Cat', 'Dog', 'Bird').required(),
        ownerName: Joi.string().min(3).required(),
        ownerAddress: Joi.string().required(),
        ownerPhone: Joi.string().length(11).required()
    });
    const { error } = schema.validate(patient);
    return error;
}

export { IPatient, Patient, validatePatient };