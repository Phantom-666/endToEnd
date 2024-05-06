import React from "react"
import { BrowserRouter } from "react-router-dom"
import AuthContext from "./Contexts/AuthContext"
import { AuthHook } from "./hooks/loginHook"
import Router from "./Router"
// TODO: change title
// TODO: change logo

const Loading = () => {
  return (
    <>
      <div>Loading...</div>
    </>
  )
}

export default () => {
  const { login, logout, token, userId, ready, loginUser, userImage } =
    AuthHook()
  const isToken = !!token
  const route = Router({ isToken, token })

  if (!ready) return <Loading />
  return (
    <>
      <AuthContext.Provider
        value={{
          login,
          logout,
          token,
          userId,
          loginUser,
          userImage,
        }}
      >
        <BrowserRouter>{route}</BrowserRouter>
      </AuthContext.Provider>
    </>
  )
}
