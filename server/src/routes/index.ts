import { Router } from "express"
import checkPassword from "./checkPassword"
import allUsers from "./allUsers"
import correspondence from "./correspondence"
import publicKey from "./PublicKey"
import checkOnlineUsers from "./checkOnlineUsers"
import register from "./register"
import chats from "./chats"

const router = Router()

router.use(
  register,
  checkPassword,
  allUsers,
  correspondence,
  publicKey,
  checkOnlineUsers,
  chats
)

export default router
