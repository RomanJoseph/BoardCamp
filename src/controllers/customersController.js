import { connection } from "../db/db.js"
import dayjs from "dayjs"

async function getCustomers (req, res) {
    const filter = res.locals.filter + '%';
    try {
        const customers = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1;`,[filter]);
        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error);
    }
};

async function getCustomerById (req, res) {
    const customer = res.locals.customer[0];
    res.send({...customer, birthday: dayjs(customer.birthday).format('YYYY-MM-DD')});
};

async function postNewCustomer (req, res) {
    const { name, phone, cpf, birthday } = res.locals.customer;
    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,[name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
};

async function editCustomerById (req, res) {
    const id = res.locals.id;
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query(
            `UPDATE customers SET "name" = $1, "phone" = $2, "cpf" = $3, "birthday" = $4 WHERE id = $5`,[name, phone, cpf, birthday, id]
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
};

export { getCustomers, getCustomerById, postNewCustomer, editCustomerById }