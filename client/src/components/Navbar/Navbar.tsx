import React, { useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import AuthContext from "../../Contexts/AuthContext"
import LiItems from "./LiItems"

type PropsType = {
  name: string
}

export default (props: PropsType) => {
  const history = useHistory()

  const goHome = () => {
    history.goBack()
  }
  useEffect(() => {
    window.M.Sidenav.init(document.querySelectorAll(".sidenav"))
  }, [])

  // useEffect(() => {
  //   if (window.document.location.pathname !== "/main") {
  //     return setBackArror(true)
  //   }
  //   return setBackArror(false)
  // }, [])

  const { loginUser, userId, userImage } = useContext(AuthContext)

  return (
    <>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper blue lighten-2">
            <a
              href="#"
              className="brand-logo center"
              onClick={() => history.push("/main")}
            >
              {props.name ? props.name : "Messenger"}
            </a>
            <ul className="left" onClick={goHome}>
              <i
                data-target="mobile-demo"
                className="material-icons"
                style={{ marginLeft: 15, cursor: "pointer" }}
              >
                arrow_back
              </i>
            </ul>
            <a
              href="#"
              data-target="slide-out"
              className="sidenav-trigger right"
            >
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <LiItems />
            </ul>
          </div>
        </nav>
      </div>

      <ul id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <a href={`/profile/${userId}`}>
              <img className="circle" src={userImage!} alt="logo" />
            </a>
            <a href={`/profile/${userId}`}>
              <span className="black-text name">{loginUser}</span>
            </a>
          </div>
        </li>
        <LiItems />
      </ul>
    </>
  )
}
