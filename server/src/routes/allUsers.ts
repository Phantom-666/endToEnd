import { Router } from "express"
import userController from "../controller/user.controller"
const router = Router()

router.get("/allusers", userController.getAllUsers)

export default router
