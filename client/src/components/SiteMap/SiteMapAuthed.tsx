import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import MainLayer from "../../Layers/MainLayer"
import AllUsers from "../AllUsers/AllUsers"
import Correspondence from "../Correspondence/Correspondence"
import Main from "../Main/Main"

type PropsType = {
  token: string | null
}

export default ({ token }: PropsType) => {
  type RedirectComponentType = { path: string }

  const RedirectComponent: React.FC<RedirectComponentType> = ({
    path,
    children,
  }) => (
    <Route exact path={path}>
      <MainLayer>{children}</MainLayer>
    </Route>
  )

  if (!token) return <div>You are not authorized</div>

  return (
    <>
      <Switch>
        <RedirectComponent path="/main">
          <Main />
        </RedirectComponent>
        <RedirectComponent path="/allusers">
          <AllUsers />
        </RedirectComponent>
        <RedirectComponent path="/correspondence/:id">
          <Correspondence token={token} />
        </RedirectComponent>
        <Redirect to="/main" />
      </Switch>
    </>
  )
}
