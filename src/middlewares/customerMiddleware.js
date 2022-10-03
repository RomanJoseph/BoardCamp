import { connection } from "../db/db.js";
import { stripHtml } from "string-strip-html";
import { customerSchema } from "../schemas/customerSchema.js"

async function validateQueryFilterCustomers (req, res, next) {
    let filter = '';
    if (req.query.cpf){
        filter = stripHtml(req.query.cpf).result;
    };
    res.locals.filter = filter;
    next();
}

async function validateCustomerId (req, res, next) {
    let id = stripHtml(req.params.ID).result;

    try {
        const validCustomer = await connection.query(
            `SELECT * FROM customers WHERE id = $1`,[id]
        );
        if (validCustomer.rows.length === 0){
            return res.status(404).send('ID DO CLIENTE NÃO ENCONTRADO');
        } else {
            res.locals.customer = validCustomer.rows;
        }
    } catch (error) {
        res.status(500).send(error);
    }
    
    res.locals.id = id;
    next();
}

async function validateCustomer (req, res, next) {
    const customer = req.body;
    const validation = customerSchema.validate(customer, {abortEarly: false});
    if(validation.error){
        return res.status(400).send(validation.error.details.map(err => err.message));
    };

    res.locals.customer = customer;
    next();
}

async function validateNewCpf (req, res, next) {
    const customer = res.locals.customer;
    const id = res.locals.id;

    try {
        const validCpf = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,[stripHtml(customer.cpf).result]
        );
        if (validCpf.rows.length !== 0){
            if (!id || Number(id) !== Number(validCpf.rows[0].id)){
                return res.status(409).send('CPF JÁ REGISTRADO');
            }
        }
    } catch (error) {
        return res.status(500).send(error);
    }
    res.locals.customer = {...customer,name: stripHtml(customer.name).result }
    next();
}

export {
    validateQueryFilterCustomers, validateCustomerId, validateCustomer, validateNewCpf
};