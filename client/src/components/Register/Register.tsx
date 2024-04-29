import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"
import { RadioPassword } from "../Login/radioPassword"

export default function Register() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [login, setLogin] = useState("")

  const [isNameCorrect, setIsNameCorrect] = useState(false)
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [isLoginCorrect, setIsLoginCorrect] = useState(false)

  const history = useHistory()

  useEffect(() => {
    if (name.length > 0) {
      setIsNameCorrect(true)
    } else {
      setIsNameCorrect(false)
    }
  }, [name])

  useEffect(() => {
    if (login.length > 0) {
      setIsLoginCorrect(true)
    } else {
      setIsLoginCorrect(false)
    }
  }, [login])

  const goTo = (path: string) => history.push(path)

  const register = async () => {
    const response = await axios.post("/api/register", {
      name,
      login,
      password,
    })

    window.M.toast({ html: response.data.status })

    goTo("/login")
  }

  const regButtonAction = () => {
    if (isNameCorrect && isLoginCorrect && isPasswordCorrect) {
      return true
    }
    return false
  }

  return (
    <div className="container">
      <div className="center">
        <div className="row">
          <h1>Register</h1>
          <div className="row">
            <div className="input-field col s12">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                type="text"
                className="validate"
              />
              <label htmlFor="name">Name</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                id="login"
                type="text"
                className="validate"
              />
              <label htmlFor="login">Login</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <RadioPassword
                fun={(password: string) => {
                  setPassword(password)
                  setIsPasswordCorrect(true)
                }}
              />
            </div>
          </div>
          <button
            disabled={!regButtonAction()}
            onClick={register}
            className="btn blue"
          >
            Register
          </button>
          <button
            style={{ marginLeft: "5px" }}
            className="btn blue"
            onClick={() => goTo("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
