require("dotenv").config()

const port = 8668

import express from "express"
import { Request, Response } from "express"
import { createConnectionSequelize } from "./servicesData/dataSource/link"

const app = express()

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ ok: true })
})

export default app
