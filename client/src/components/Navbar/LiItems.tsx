import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import AuthContext from "../../Contexts/AuthContext"

export default () => {
  const { logout } = useContext(AuthContext)
  return (
    <>
      <li>
        <NavLink to="/main">Главная</NavLink>
      </li>
      <li>
        <NavLink to="/allusers">Все пользователи</NavLink>
      </li>
      <li>
        <a href="#" onClick={logout}>
          Выход
        </a>
      </li>
    </>
  )
}
