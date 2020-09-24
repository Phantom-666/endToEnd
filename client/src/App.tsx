import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import AuthContext from './Contexts/AuthContext'
import {AuthHook} from './hooks/loginHook'
import Router from './Router'



export default () => {
  const {
    login,
    logout,
    token,
    userId,
    ready,
    loginUser,
    userImage,
  } = AuthHook()
  const isToken = !!token
  const route = Router({isToken, token})

  
  if (!ready) {
    return (
      <>
        <div>Loading...</div>
      </>
    )
  }

  

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
