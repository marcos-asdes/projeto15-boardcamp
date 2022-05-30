import express from 'express';

import { validationSchema } from '../middlewares/validationMiddleware.js';
import { customerSchema } from '../schemas/customerSchema.js';
import { editCustomer, getCustomer, getCustomers, sendCustomer } from '../controllers/customersControllers.js';

const customersRouter = express.Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post(
    '/customers',
    (req, res, next) => {
        validationSchema(req, res, next, customerSchema);
    },
    sendCustomer
);
customersRouter.put(
    '/customers/:id',
    (req, res, next) => {
        validationSchema(req, res, next, customerSchema);
    },
    editCustomer
);

export default customersRouter;