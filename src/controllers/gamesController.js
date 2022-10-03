import { connection } from "../db/db.js"

async function getGames(req, res){
    const filter = res.locals.filter
    try {
        const games = await connection.query(
            `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE LOWER(games.name) LIKE $1;`,[filter+'%']
        )
        res.send(games.rows)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function postGame (req,res) {
    const { name, image, stockTotal, categoryId, pricePerDay} = res.locals.game
    console.log(res.locals.game)
    try {
        await connection.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,[name, image, stockTotal, categoryId, pricePerDay]
        )
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error)
    }
}

export { getGames, postGame }