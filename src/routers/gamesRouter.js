import express from 'express'
import { getGames, postGame } from '../controllers/gamesController.js'
import { validateQueryFilterGames, validateNewGame } from '../middlewares/gamesMiddleware.js'

const router = express.Router()

router.get('/games', validateQueryFilterGames, getGames)
router.post('/games', validateNewGame, postGame)

export default router