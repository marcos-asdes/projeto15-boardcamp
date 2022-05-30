import express from 'express';

import { validationSchema } from '../middlewares/validationMiddleware.js';
import { checkRentalExists } from '../middlewares/checkExistsMiddleware.js';
import { rentalSchema } from '../schemas/rentalSchema.js';
import { deleteRental, getRentals, returnRental, sendRental } from '../controllers/rentalsControllers.js';

const rentalsRouter = express.Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post(
    '/rentals',
    (req, res, next) => {
        validationSchema(req, res, next, rentalSchema);
    },
    sendRental
);
rentalsRouter.post('/rentals/:id/return', checkRentalExists, returnRental);
rentalsRouter.delete('/rentals/:id', checkRentalExists, deleteRental);

export default rentalsRouter;