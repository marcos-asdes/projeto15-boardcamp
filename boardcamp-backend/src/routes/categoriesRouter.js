import express from 'express';

import { validateSchema } from '../middlewares/validationMiddleware.js';
import { categorySchema } from '../schemas/categorySchema.js';
import { getCategories, sendCategory } from '../controllers/categoriesControllers.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/categories', getCategories);

categoriesRouter.post(
    '/categories',
    (req, res, next) => {
        validateSchema(req, res, next, categorySchema);
    },
    sendCategory
);

export default categoriesRouter;