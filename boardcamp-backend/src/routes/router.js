import express from 'express';

import categoriesRouter from './categoriesRouter.js';
//import gamesRouter from './gamesRouter.js';
//import costumersRouter from './costumersRouter.js';
//import rentalsRouter from './rentalsRouter.js';

const router = express.Router();

router.use(categoriesRouter);
//router.use(gamesRouter);
//router.use(costumersRouter);
//router.use(rentalsRouter);

export default router;