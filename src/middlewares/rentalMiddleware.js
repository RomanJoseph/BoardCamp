import { connection } from "../db/db.js";
import { rentalSchema } from "../schemas/rentalsSchema.js"

async function validateQueryFilterRentals (req, res, next) {
    let customerFilter = -1;
    let gameFilter = -1;

    if (!isNaN(Number(req.query.customerId))) {
        customerFilter = Number(req.query.customerId);
    };
    if (!isNaN(Number(req.query.gameId))) {
        gameFilter = Number(req.query.gameId);
    };

    res.locals.customerFilter = customerFilter;
    res.locals.gameFilter = gameFilter;
    next();
}

async function validateRentalInputs (req, res, next) {
    const rentalObj = req.body;
    let game = null;

    const validation = rentalSchema.validate(rentalObj, {abortEarly: false});
    if (validation.error){
        return res.status(400).send(validation.error.details.map(err => err.message));
    };

    try {
        const validId = await connection.query(
            `SELECT * FROM customers WHERE id = $1;`,
            [rentalObj.customerId]
        );
        if (validId.rows.length === 0){
            return res.status(400).send('Cliente não encontrado');
        }
    } catch (error) {
        return res.status(500).send(error);
    }

    try {
        const validGame = await connection.query(
            `SELECT * FROM games WHERE id = $1;`,
            [rentalObj.gameId]
        );
        if (validGame.rows.length === 0){
            return res.status(400).send('Jogo não encontrado');
        }
        game = validGame.rows[0];
    } catch (error) {
        return res.status(500).send(error);
    }

    try {
        const rentalQnt = await connection.query(
            `SELECT * FROM rentals
            WHERE
                "gameId" = $1
                AND
                "returnDate" IS NULL
            ;`,[rentalObj.gameId]
        );
        if (rentalQnt.rows.length >= game.stockTotal){
            return res.status(400).send('Jogo não disponível');
        }
    } catch (error) {
        return res.status(500).send(error);
    }

    res.locals.rentalObj = rentalObj;
    res.locals.game = game;

    next();
}

async function validateRentalIdInput (req, res, next) {
    const id = Number(req.params.ID);
    let rentalObj = null;

    if (isNaN(id)){
        return res.status(400).send('Id inválido');
    };

    try {
        const validRental = await connection.query(
            `SELECT * FROM rentals WHERE id = $1;`,[id]
        );
        if (validRental.rows.length === 0) {
            return res.status(404).send('Id não encontrado');
        }
        rentalObj = validRental.rows[0];
    } catch (error) {
        return res.status(500).send(error);
    };

    if (rentalObj.returnDate) {
        return res.status(400).send('O empréstimo já acabou');
    }
    
    res.locals.rentalObj = rentalObj;
    next();
}

export { validateQueryFilterRentals, validateRentalInputs, validateRentalIdInput }