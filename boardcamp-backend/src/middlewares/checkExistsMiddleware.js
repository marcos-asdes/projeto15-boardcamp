import connection from '../database.js';

export async function checkGameExists(req, res, next) {
    const name = req.body.name;

    try {
        const result = await connection.query(
            `SELECT * FROM games
            WHERE name = $1
            `,
            [name]
        );

        if (result.rows.length > 0) {
            res.sendStatus(409);
            return;
        }
        next();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function checkCustomerExists(req, res, next) {
    const id = req.params.id;

    try {
        const customerResult = await connection.query(
            `SELECT * FROM customers
            WHERE id = $1`,
            [id]
        );

        if (customerResult.rows.length > 0) {
            next();
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function checkRentalExists(req, res, next) {
    const id = req.params.id;

    try {
        const rentalResult = await connection.query(
            `SELECT * FROM rentals
            WHERE id = $1`,
            [id]
        );

        if (rentalResult.rows.length > 0) {
            res.locals.rental = rentalResult.rows[0];
            next();
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}