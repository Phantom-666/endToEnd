import { Router } from "express"
import userController from "../controller/user.controller"

const router = Router()

router.post("/chats", userController.getChats)

export default router
