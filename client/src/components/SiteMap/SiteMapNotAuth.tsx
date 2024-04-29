import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import Login from "../Login/Login"
import Register from "../Register/Register"

export default () => {
  return (
    <Switch>
      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/register">
        <Register />
      </Route>
      <Redirect to="/login" />
    </Switch>
  )
}
