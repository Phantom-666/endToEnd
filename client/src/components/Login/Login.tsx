import React, { useState, useContext } from "react"
import AuthContext from "../../Contexts/AuthContext"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { RadioPassword } from "./radioPassword"

export default () => {
  const [userLogin, setUserLogin] = useState<string>("")
  const [loginState, setLoginState] = useState<boolean>(false)

  const { login } = useContext(AuthContext)

  const checkPassword = async (
    password: string,
    renderFailure: (message: string) => void
  ) => {
    try {
      type ResponseType = {
        data: { id: string; image: string; logUser: string; token: string }
      }
      const response: ResponseType = await axios.post("/api/checkPassword", {
        login: userLogin,
        password,
      })
      return login(
        response.data.token,
        response.data.id,
        response.data.logUser,
        response.data.image
      )
    } catch (e) {
      renderFailure((e as any).response.data.message)
    }
  }

  const userLoginHandler = (e: any) => {
    setUserLogin(e.target.value)
  }

  const history = useHistory()

  const goTo = (path: string) => {
    history.push(path)
  }

  return (
    <>
      <div className="center ">
        <br />
        {loginState && (
          <i
            style={{ cursor: "pointer" }}
            onClick={() => setLoginState(false)}
            className="material-icons"
          >
            call_missed
          </i>
        )}
        <h1>Login</h1>
        {!loginState ? (
          <div className="container">
            <input type="text" onChange={userLoginHandler} value={userLogin} />
            <button className="btn blue" onClick={() => setLoginState(true)}>
              Submit
            </button>

            <button
              style={{ marginLeft: "5px" }}
              className="btn blue"
              onClick={() => goTo("/register")}
            >
              Register
            </button>
          </div>
        ) : (
          <RadioPassword fun={checkPassword} />
        )}
      </div>
    </>
  )
}
