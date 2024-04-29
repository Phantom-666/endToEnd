import { Request, Response } from "express"
import db from "../db/db"
import { checkToken } from "../functions/checkToken"
import { sign } from "jsonwebtoken"
import bcrypt from "bcrypt"
const phrase = process.env.SECRET_PHRASE || "secret"

class UserController {
  async register(req: Request, res: Response) {
    const { name, login, password } = req.body
    const user = await db.createUser(name, login, password)
    res.status(200).json({ status: "success", user })
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const status = await checkToken(req)

      if (!status) return res.status(400).json({ message: "Server Error" })

      const users = await db.findAll()

      res.status(200).json({ users })
    } catch (e) {
      res.status(400).json({ message: "Server Error" })
    }
  }

  async checkPassword(req: Request, res: Response) {
    try {
      const { login, password } = req.body

      const isUser = await db.findOne({ login })

      if (!isUser) return res.status(400).json({ message: "Something wrong" })

      const hashStatus = await bcrypt.compare(password, isUser.password)

      if (!hashStatus)
        return res.status(400).json({ message: "Something wrong" })

      const token = sign({ id: isUser.id }, phrase)
      const options = {
        token,
        id: isUser.id,
        logUser: isUser.name,
        image: isUser.image,
      }
      return res.status(200).json(options)
    } catch (e) {
      res.status(400).json({ message: "Something wrong" })
    }
  }

  async correspondence(req: Request, res: Response) {
    try {
      const id: string = req.params.id
      const status: any = await checkToken(req)
      if (!status) return res.status(400).json({ message: "Server Error" })

      const isPartner = await db.findById(id)

      if (!isPartner) return res.status(400).json({ message: "Server Error" })
      res.status(200).json({ name: isPartner.name, image: isPartner.image })
    } catch (error) {
      res.status(400).json({ message: "Server Error" })
    }
  }

  async getPublicKey(req: Request, res: Response) {
    try {
      const status = await checkToken(req)
      if (!status) return res.status(400).json({ message: "Server Error" })
      const isParther = await db.findById(req.params.id)
      if (!isParther) return res.status(400).json({ message: "Server Error" })
      res.status(200).json({ publicKey: isParther.publicKey })
    } catch (e) {
      res.status(400).json({ message: "Server Error" })
    }
  }

  async setPublicKey(req: Request, res: Response) {
    try {
      const { publicKey } = req.body
      const user = await checkToken(req)
      if (!user) return res.status(400).json({ message: "Server Error" })
      user.isUser.publicKey = JSON.stringify(publicKey)
      await user.isUser.save()
      res.status(200).json({ message: "Ok" })
    } catch (e) {
      res.status(400).json({ message: "Server Error" })
    }
  }

  async getChats(req: Request, res: Response) {
    const isValid = await checkToken(req)

    const { users } = req.body

    if (!isValid) return res.status(400).json({ message: "Server Error" })

    // const user = await db.findOne({ login: isValid.isUser.login })

    const result = []

    for (let i = 0; i < users.length; i++) {
      const user = await db.findById(users[i])

      if (user) {
        result.push(user.name)
      }
    }

    res.status(200).json({ chats: result })
  }
}

export default new UserController()
