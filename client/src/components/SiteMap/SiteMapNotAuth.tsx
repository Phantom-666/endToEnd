import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'

export default () => {
  return (
    <Switch>
      <Route exact path='/login'>
        <Login />
      </Route>
      <Redirect to='/login' />
    </Switch>
  )
}
