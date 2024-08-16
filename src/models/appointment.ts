import Joi from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

interface IPatient {
    _id: mongoose.Types.ObjectId;
    petName: string;
    ownerPhoneNumber: string;
}

interface IAppointment extends Document {
    patient: IPatient;
    appointmentStartTime: Date;
    appointmentEndTime: Date;
    description: string;
    feeAmount: number;
    feeStatus: 'USD' | 'EUR' | 'Bitcoin' | 'Unpaid';
}

const appointmentSchema = new Schema<IAppointment>({
    patient: { 
        type: new Schema({
            _id: { type: Schema.Types.ObjectId, required: true },
            petName: { type: String, required: true },
            ownerPhoneNumber: { type: String, required: true }
        }),  
        required: true
    },
    appointmentStartTime: { type: Date, required: true },
    appointmentEndTime: { type: Date, required: true },
    description: { 
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 255 
    },
    feeAmount: { type: Number, required: true },
    feeStatus: { 
        type: String, 
        enum: ['USD', 'EUR', 'Bitcoin', 'Unpaid'], 
        required: true 
    }
});

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

function validateAppointment(appointment: any) {
    const schema = Joi.object({
        patientId: Joi.string().length(24).required(),
        appointmentStartTime: Joi.date().iso().required(),
        appointmentEndTime: Joi.date().iso().required(),
        description: Joi.string().min(5).max(255).required(),
        feeAmount: Joi.number().required(),
        feeStatus: Joi.string().valid('USD', 'EUR', 'Bitcoin', 'Unpaid').required()
    });

    return schema.validate(appointment).error;
}

export { Appointment, validateAppointment };