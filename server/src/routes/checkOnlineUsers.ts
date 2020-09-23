import {Router} from 'express'
import {onlineUsers} from '../socket/socket'
const router = Router()


router.post('/checkonlineusers', (req, res) => {
    const {id} = req.body
    const status = onlineUsers.findIndex(u => u.userId === id)
    if (status > -1) res.status(200).json({status : true})
    else res.status(200).json({status : false})
})


module.exports = router