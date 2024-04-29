import React, { useContext, useEffect, useState } from "react"
import CollBody from "./Coll-Body"
import axios from "axios"
import { UsersType, UsersTypeFromServer } from "./types"
import AuthContext from "../../Contexts/AuthContext"

export default () => {
  useEffect(() => {
    M.Collapsible.init(document.querySelectorAll(".collapsible"))
  }, [])

  const [users, setUsers] = useState<UsersType[]>([])

  const { token } = useContext(AuthContext)

  const takeUsers = async () => {
    try {
      const allUsers: UsersTypeFromServer = await axios.get("/api/allusers", {
        headers: { token },
      })

      setUsers(allUsers.data.users)
    } catch (e) {
      window.M.toast({ html: "Server Error" })
    }
  }

  useEffect(() => {
    takeUsers()
  }, [])

  return (
    <>
      <div className="container">
        <ul className="collapsible">
          <li>
            <div className="collapsible-header">
              <i className="material-icons">filter_drama</i>Все пользователи
            </div>
            <div className="collapsible-body">
              <ul className="collection with-header">
                {users.map((c) => (
                  <CollBody key={c._id} name={c.name} id={c._id} />
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}
