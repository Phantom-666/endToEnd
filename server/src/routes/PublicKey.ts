import { Router } from "express"
import userController from "../controller/user.controller"

const router = Router()

router.get("/getpublickey/:id", userController.getPublicKey)
router.post("/setpublickey", userController.setPublicKey)

export default router
