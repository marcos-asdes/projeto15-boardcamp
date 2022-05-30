import joi from 'joi';

export const customerSchema = joi.object({
    cpf: joi.string().length(11).pattern(/^[0-9]*$/).required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]*$/).required(),
    name: joi.string().required(),
    birthday: joi.date().iso().required()
});