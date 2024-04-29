import { Router } from "express"

import userController from "../controller/user.controller"
const router = Router()

router.post("/checkPassword", userController.checkPassword)

export default router
