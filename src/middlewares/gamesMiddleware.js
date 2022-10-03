import { stripHtml } from "string-strip-html"
import { connection } from "../db/db.js"
import { gameSchema } from "../schemas/gameSchema.js"

async function validateQueryFilterGames (req, res, next) {
    let filter = ''

    if (req.query.name) {
        filter = stripHtml(req.query.name.toLowerCase()).result
    }
    
    res.locals.filter = filter
    next()
}

async function validateNewGame (req, res, next) {
    const game = req.body
    const validation = gameSchema.validate(game, {abortEarly: false})

    if(validation.error){
        return res.status(400).send(validation.error.details.map(err => err.message))
    }

    try {
        const validId = await connection.query(
            `SELECT * FROM categories WHERE id = $1`,[game.categoryId]
        )
        if (validId.rows.length === 0){
            return res.status(400).send('categoryId not found')
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    try {
        
        const validName = await connection.query(
            `SELECT * FROM games WHERE name = $1`,[stripHtml(game.name).result]
        )
        if (validName.rows.length !== 0){
            return res.status(409).send('Jogo já existe!')
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    res.locals.game = {...game,
        name:stripHtml(game.name).result,
        image:stripHtml(game.image).result
    }
    next()
}

export { validateQueryFilterGames, validateNewGame }