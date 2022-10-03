import { connection } from "../db/db.js"
import { stripHtml } from "string-strip-html"

async function validateCategoriesInput (req, res, next) {
    let name = req.body.name

    if (!name){
        return res.status(400).send('A caregoria precisa ter um nome')
    }

    try {
        const sameCategory = await connection.query('SELECT * FROM categories WHERE name = $1', [stripHtml(name).result])
        if(sameCategory.rows.length !== 0){
            return res.status(409).send('Já existe um jogo dom esse nome')
        }
    } catch (error) {
        return res.status(500).send(error)
    }

    res.locals.name = stripHtml(name).result
    next()
}

export { validateCategoriesInput }