import connection from '../database.js';

export async function getCustomers(req, res) {
    let filter = req.query.cpf;
    filter = filter ? filter + "%" : "%";

    try {
        const result = await connection.query(
            `SELECT * FROM customers WHERE cpf LIKE $1`,[filter]
        );
        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function getCustomer(req, res) {
    const { id } = req.params;

    try {
        const result = await connection.query(
            `SELECT * FROM customers WHERE id = $1`,[id]
        );

        if (result.rows.length === 0) {
            res.sendStatus(404);
        }

        res.send(result.rows[0]);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function sendCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customer = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,[cpf]
        );

        if (customer.rows.length > 0) {
            res.sendStatus(409);
            return;
        }

        await connection.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,[name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export async function editCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customer = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,[cpf]
        );

        if(customer.rows.length > 0 && customer.rows[0].id !== parseInt(id)) {
            res.sendStatus(409);
            return;
        }

        await connection.query(
            `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id= $5`,[name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}