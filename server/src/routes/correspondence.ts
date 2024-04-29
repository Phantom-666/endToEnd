import { Router } from "express"
import userController from "../controller/user.controller"
const router = Router()

router.get("/correspondence/:id", userController.correspondence)

export default router
