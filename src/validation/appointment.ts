import Joi from 'joi';

export function validateAppointment(appointment: any) {
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