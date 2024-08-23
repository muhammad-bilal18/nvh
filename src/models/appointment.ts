
import mongoose, { Document, Schema } from 'mongoose';

interface IPatient {
    _id: mongoose.Types.ObjectId;
    petName: string;
    ownerPhoneNumber: string;
}

enum FeeStatus {
    USD = 'USD',
    EUR = 'EUR',
    Bitcoin = 'Bitcoin',
    Unpaid = 'Unpaid'
}

interface IAppointment extends Document {
    patient: IPatient;
    appointmentStartTime: Date;
    appointmentEndTime: Date;
    description: string;
    feeAmount: number;
    feeStatus: string;
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
        enum: Object.values(FeeStatus),
        required: true 
    }
});

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);



export { Appointment };