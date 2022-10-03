import express from "express"
import cors from "cors"
import customersRouter from "./routers/customerRouter.js"
import gameRouter from "./routers/gamesRouter.js"
import categoriesRouter from "./routers/categoriesRouter.js"

const server = express();
server.use(cors())
server.use(express.json())

server.use(customersRouter)
server.use(gameRouter)
server.use(categoriesRouter)

server.get("/status", (req, res) => {
    res.send("okay")
})

server.listen(4000,() => console.log("Magic Happens on 4000"))