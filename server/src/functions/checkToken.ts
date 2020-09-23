import {verify} from 'jsonwebtoken'
import User from '../schema/userSchema'
const phrase = 'key321eswdw@3eqedq21'


const checkToken = async (req:any) => {
    try {
        const token : string = req.headers.token
        const isToken : any = verify(token, phrase)
        if (!isToken) return false
        const isUser = await User.findById(isToken.id)
        if (!isUser) return false
        return { isUser }
    } catch (error) {
        return false
    }
} 

export { checkToken }