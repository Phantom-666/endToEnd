import { Request, Response } from "express"
import { onlineUsers } from "../socket/socket"

class SocketController {
  async checkOnlineUsers(req: Request, res: Response) {
    const { id } = req.body
    const status = onlineUsers.findIndex((u) => u.userId === id)
    if (status > -1) res.status(200).json({ status: true })
    else res.status(200).json({ status: false })
  }
}

export default new SocketController()
