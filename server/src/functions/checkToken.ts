import { verify } from "jsonwebtoken"
import db from "../db/db"

const phrase = process.env.SECRET_PHRASE || "secret"

const checkToken = async (req: any) => {
  try {
    const token: string = req.headers.token
    const isToken: any = verify(token, phrase)
    if (!isToken) return false

    const isUser = await db.findById(isToken.id)

    if (!isUser) return false
    return { isUser }
  } catch (error) {
    return false
  }
}

export { checkToken }
