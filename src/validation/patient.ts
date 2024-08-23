import Joi, { ValidationError } from 'joi';
export function validatePatient(patient: any) {
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