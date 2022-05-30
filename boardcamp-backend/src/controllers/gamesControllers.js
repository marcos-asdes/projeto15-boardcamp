import connection from '../database.js';

export async function getGames(req, res) {
    let filter = req.query.name?.toLowerCase();
    filter = filter ? filter + "%" : "%";

    try {
        const result = await connection.query(
            `SELECT games.*, categories.name AS "categoryName" 
            FROM games
            JOIN categories ON games."categoryId" = categories.id
            WHERE LOWER(games.name) 
            LIKE $1
            `,
            [filter]
        );

        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
}

export async function sendGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        const category = await connection.query(
            `SELECT * FROM categories
            WHERE id = $1
            `, 
            [categoryId]
        );

        if (category.rows.length === 0) {
            res.sendStatus(400);
            return;
        }

        await connection.query(
            `INSERT INTO games
            (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)
            `,
            [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}