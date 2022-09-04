import app from "../app"
import http from "http"

const port: number = Number(process.env.PORT) || 8080

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`server listen on ${port}`)
})
