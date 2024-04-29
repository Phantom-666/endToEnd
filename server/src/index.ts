import { app, server, serverHttps } from "./socket/socket"
import express from "express"
import cors from "cors"
import { resolve } from "path"
import "dotenv/config"
import db from "./db/db"
import routes from "./routes"

const run = async () => {
  const mongoDbUri = process.env.MONGO_DB
  const httpPort = Number(process.env.HTTP_PORT) || 3000
  // const httpsPort = Number(process.env.HTTPS_PORT) || 3443

  if (!mongoDbUri) throw new Error("MONGO_DB is undefined")

  app.use(cors())
  app.use(express.json())

  app.use("/api", routes)

  console.log("mode=" + process.env.NODE_ENV)

  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.protocol === "http")
        return res.redirect(`https://${req.hostname}:443`)
      next()
    })
    app.use(
      "/",
      express.static(resolve(__dirname, "..", "..", "client", "build"))
    )
    app.get("*", (req, res) => {
      res.sendFile(
        resolve(__dirname, "..", "..", "client", "build", "index.html")
      )
    })
  }

  // serverHttps.listen(httpsPort, () =>
  //   console.log(`Server is starting on HTTPS port : ${httpsPort}`)
  // )
  server.listen(httpPort, () => console.log(`Server started ${httpPort}`))

  await db.connect(mongoDbUri)
}

run()
