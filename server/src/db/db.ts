import { connect } from "mongoose"
import Users from "../schema/userSchema"
import bcrypt from "bcrypt"

type User = { login: string }
type UserWithPassword = { login: string; password: string }

class MongoDb {
  async connect(url: string) {
    await connect(url)

    console.log("Connected to database")
  }

  async findAll() {
    const users = await Users.find({}, ["name"])

    return users
  }

  async createUser(name: string, login: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await Users.create({ name, login, password: hashedPassword })

    return user
  }

  async findOne(data: User | UserWithPassword) {
    const user = await Users.findOne(data)
    return user
  }

  async findById(id: string) {
    const user = await Users.findById(id)

    return user
  }
}

const db = new MongoDb()

export default db
