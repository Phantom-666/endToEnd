import {Router} from 'express'
import {sign, verify} from 'jsonwebtoken'
import UserSchema from '../schema/userSchema'
const router = Router()
const phrase = 'key321eswdw@3eqedq21'

router.post('/checkPassword', async (req, res) => {
  const fail = () => res.status(400).json({message: 'Something wrong'})
  try {
    const {login, password} = req.body
    const isUser = await UserSchema.findOne({login, password})
    if (!isUser) return fail()
    const token = sign({id: isUser.id}, phrase)
    const options = {
      token,
      id: isUser.id,
      logUser: isUser.name,
      image: isUser.image,
    }
    return res.status(200).json(options)
  } catch (e) {
    fail()
  }
})

module.exports = router
