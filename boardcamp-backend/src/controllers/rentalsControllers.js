import connection from '../database.js';

export async function getRentals(req, res) {
    const customerFilter = parseInt(req.query.customerId);
    const gameFilter = parseInt(req.query.gameId);
    try {
        const rentalsResult = await connection.query(
            `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
            JOIN categories ON games."categoryId" = categories.id
            `
        );

        let rentals = rentalsResult.rows;

        if (customerFilter) {
            rentals = rentals.filter(
                (rental) => rental.customerId === customerFilter
            );
        }

        if (gameFilter) {
            rentals = rentals.filter((rental) => rental.gameId === gameFilter);
        }

        rentals = rentals.map((rental) => {
            const {
                customerName,
                customerId,
                gameName,
                gameId,
                categoryId,
                categoryName,
                ...rentalInfo
            } = rental;
            return {
                ...rentalInfo,
                gameId: gameId,
                customerId: customerId,
                customer: {
                    id: customerId,
                    name: customerName,
                },
                game: {
                    id: gameId,
                    name: gameName,
                    categoryId: categoryId,
                    categoryName: categoryName,
                }
            };
        });

        res.send(rentals);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function sendRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = new Date().toISOString();
    const returnDate = null;
    const delayFee = null;

    try {
        const customerResult = await connection.query(
            `SELECT * FROM customers
            WHERE id = $1`,
            [customerId]
        );

        if (customerResult.rows.length === 0) {
            res.sendStatus(400);
            return;
        }

        const gameResult = await connection.query(
            `SELECT * FROM games
            WHERE id = $1`,
            [gameId]
        );

        if (gameResult.rows.length === 0) {
            res.sendStatus(400);
            return;
        }

        const game = gameResult.rows[0];
        const originalPrice = game.pricePerDay * daysRented;

        const rentalsResult = await connection.query(
            `SELECT * FROM rentals
            WHERE "gameId" = $1`,
            [gameId]
        );

        if (
            rentalsResult.rows.length > 0 &&
            rentalsResult.rows.length >= game.stockTotal
        ) {
            res.sendStatus(400);
        }

        await connection.query(
            `INSERT INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
            ]
        );

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function returnRental(req, res) {
    const rental = res.locals.rental;

    if(rental.returnDate !== null){
        res.sendStatus(400);
        return;
    }
    const returnDate = new Date().toISOString();
    try {
        const gameResult = await connection.query(
            `SELECT * FROM games
            WHERE id = $1`, [rental.gameId]
        );

        const game = gameResult.rows[0];
        
        const daysToMilliseconds = 86400000;
        const idealReturnDate = new Date(
            new Date(rental.rentDate).getTime() + rental.daysRented * daysToMilliseconds
        );

        let delayFee;

        if (new Date(returnDate) > new Date(idealReturnDate)) {
            const delay = (new Date(new Date(returnDate).getTime() - new Date(rental.rentDate).getTime())) / daysToMilliseconds;

            delayFee = Math.floor(delay) * game.pricePerDay
        } else {
            delayFee = 0;
        }
        
        await connection.query(
            `UPDATE rentals
            SET "returnDate" = $1,
            "delayFee" = $2
            WHERE id = $3
            `, [returnDate, delayFee, rental.id]
        );

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    const id = req.params.id;
    const rental = res.locals.rental;

    if (rental.returnDate !== null) {
        res.sendStatus(400);
        return;
    }

    try {
        const rentalResult = await connection.query(
            `DELETE FROM rentals
            WHERE id = $1
            `,
            [id]
        );

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}