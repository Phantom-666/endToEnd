import {Router} from 'express'
import { checkToken } from '../functions/checkToken'
import userSchema from '../schema/userSchema'
const router = Router()



router.get('/getpublickey/:id', async (req, res) => {

    const fail = () => res.status(400).json({message : 'Server Error'})
    try {
        const status = await checkToken(req)
        if (!status) return fail()
        const isParther = await userSchema.findById(req.params.id)
        if (!isParther) return fail()
        res.status(200).json({publicKey : isParther.publicKey})
    } catch (e) {
        fail()
    }
})

router.post('/setpublickey', async(req, res) => {
    const fail = () => res.status(400).json({message : 'Server Error'})
    try {
        const {publicKey} = req.body 
        const user = await checkToken(req)
        if (!user) return fail()
        user.isUser.publicKey = JSON.stringify(publicKey)
        await user.isUser.save()
        res.status(200).json({message : 'Ok'})
    } catch (e) {
        fail()
    }
})

module.exports = router