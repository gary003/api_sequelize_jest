require("dotenv").config()

import express from "express"
import { Request, Response } from "express"

const app = express()

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ ok: true })
})

export default app
