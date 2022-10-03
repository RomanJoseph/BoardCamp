import express from "express"
import cors from "cors"
import customersRouter from "./routers/customerRouter.js"

const server = express();
server.use(cors())
server.use(express.json())

server.use(customersRouter)

server.get("/status", (req, res) => {
    res.send("okay")
})

server.listen(4000,() => console.log("Magic Happens on 4000"))