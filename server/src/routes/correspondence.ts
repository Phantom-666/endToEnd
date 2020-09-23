import {Router} from 'express'
import {checkToken} from '../functions/checkToken'
import User from '../schema/userSchema'
const router = Router()


router.get('/correspondence/:id', async (req, res) => {
    const fail = () => res.status(400).json({message : 'Server Error'})
    try {
        const id : string = req.params.id
        const status : any = await checkToken(req)
        if (!status) return fail()
        const isPartner = await User.findById(id)
        if (!isPartner) return fail()
        res.status(200).json({name : isPartner.name})
    } catch (error) {
        fail()
    }
})

module.exports = router