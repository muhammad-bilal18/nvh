import mongoose, { Document, Schema } from 'mongoose';

enum PetType {
    Cat = 'Cat',
    Dog = 'Dog',
    Bird = 'Bird',
}

interface IPatient extends Document {
    petName: string;
    petType: string;
    ownerName: string;
    ownerAddress: string;
    ownerPhone: string;
}

const patientSchema = new Schema<IPatient>({
    petName: {
        type: String,
        required: true,
        minlength: 3,
    },
    petType: {
        type: String,
        enum: Object.values(PetType),
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
        minlength: 4,
    },
    ownerAddress: {
        type: String,
        required: true,
    },
    ownerPhone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
    },
});

const Patient = mongoose.model<IPatient>('Patient', patientSchema);

export { IPatient, Patient };