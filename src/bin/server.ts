import app from "../app"
import http from "http"
import ip from "ip"

const port: number = Number(process.env.PORT) || 8080

const localIp: string = ip.address()

const server = http.createServer(app)

server.on("error", (error) => {
  console.log(error)
  process.exit(1)
})

server.on("listening", () => {
  console.log(`listen on http://${localIp}:${port}`)
  console.log(`swagger/OpenAPI on http://${localIp}:${port}/apiDoc`)
})

server.listen(port, () => {
  console.log(`server listen on ${port}`)
})
