import { Router } from "express"
import socketController from "../controller/socket.controller"

const router = Router()

router.post("/checkonlineusers", socketController.checkOnlineUsers)

export default router
