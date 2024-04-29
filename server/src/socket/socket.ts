import express from "express"
import { readFileSync } from "fs"
import http from "http"
import https from "https"
import { resolve } from "path"
import ioSocket from "socket.io"
const privatePath = resolve(__dirname, "..", "..", "ssl", "private.key")
const certPath = resolve(__dirname, "..", "..", "ssl", "cert.crt")

const options = {
  key: readFileSync(privatePath),
  cert: readFileSync(certPath),
}
const app = express()
const server = http.createServer(app)
const serverHttps = https.createServer(options, app)
const io = ioSocket(server)

type OnlineUsers = {
  id: string
  userId: string
}

let onlineUsers: OnlineUsers[] = []

io.sockets.on("connection", (socket) => {
  console.log("connect", socket.id)

  const userId = socket.handshake.query.userId

  const pushToOnline = () => {
    const token = socket.handshake.query.token

    const newUser = {
      id: socket.id,
      userId,
    }
    const status = onlineUsers.find((u) => u.userId === userId)
    const warning = () => console.log("warning")
    if (status) return warning()
    onlineUsers.push(newUser)
    console.log("onlineUsers", onlineUsers)

    io.emit(`isOnline_${userId}`, { status: true })
  }

  socket.on(`isOnline`, ({ userId }: { userId: string }) => {
    let status = false
    for (let i = 0; i < onlineUsers.length; ++i) {
      if (onlineUsers[i].userId === userId) {
        status = true
        break
      }
    }

    socket.emit(`isOnline`, { status })
  })

  pushToOnline()

  socket.on("sendMessage", (data: { id: string; message: any }) => {
    const partner = onlineUsers.find((u) => u.userId === data.id)
    const instance = onlineUsers.find((u) => u.id === socket.id)

    if (!partner) return
    if (!instance) return

    io.to(partner.id).emit("messageForYou", {
      id: instance.userId,
      message: data.message,
    })
  })

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id)

    let user = null

    for (let i = 0; i < onlineUsers.length; ++i) {
      if (onlineUsers[i].id === socket.id) {
        user = onlineUsers[i]
        break
      }
    }

    if (user) {
      //check in online subscribers

      io.emit(`isOnline_${userId}`, { status: false })
    }

    onlineUsers = onlineUsers.filter((u) => u.id !== socket.id)
  })
})

export { app, server, serverHttps, onlineUsers }
