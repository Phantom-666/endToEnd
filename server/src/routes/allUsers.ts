import {Router} from 'express'
import Users from '../schema/userSchema'
import { checkToken } from '../functions/checkToken'
const router = Router()

router.get('/allusers', async (req, res) => {
  const fail = () => res.status(400).json({message : 'Server Error'})
  try {
    const status = await checkToken(req)
    if (!status) return fail()
    const users = await Users.find({}, ['name'])
    res.json({users})
  } catch (e) {
    fail()
  }
})

module.exports = router
