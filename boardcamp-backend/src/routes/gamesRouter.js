import express from 'express';

import { validationSchema } from '../middlewares/validationMiddleware.js';
import { gameSchema } from './../schemas/gameSchema.js';
import { getGames, sendGame } from './../controllers/gamesControllers.js';

const gamesRouter = express.Router();

gamesRouter.get('/games', getGames);
gamesRouter.post(
    '/games',
    (req, res, next) => {
        validationSchema(req, res, next, gameSchema);
    },
    sendGame
);

export default gamesRouter;