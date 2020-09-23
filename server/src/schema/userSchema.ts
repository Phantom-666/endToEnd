import { model, Schema, Document} from 'mongoose'


interface userType extends Document {
    name : string
    login : string,
    password : string,
    image : string,
    publicKey : string
}

const userSchema = new Schema({
    login : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : 'https://i.pinimg.com/236x/df/b9/48/dfb9480c1ae5b4948a37e16f1df23297.jpg'
    },
    publicKey: {
        type : String
    },
    name : {
        type : String
    }
})


export default model<userType>('Users', userSchema, 'users')