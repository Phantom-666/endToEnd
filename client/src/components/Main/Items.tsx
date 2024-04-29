import React from "react"
import "./items.css"
import { useHistory } from "react-router-dom"

export default ({ name, id }: { name: string; id: string }) => {
  const history = useHistory()
  const goToContact = () => {
    history.push(`/correspondence/${id}`)
  }

  return (
    <>
      <li
        style={{ cursor: "pointer" }}
        className="collection-item avatar"
        onClick={goToContact}
      >
        <i className="material-icons circle green">insert_chart</i>
        <span className="title">{name}</span>
        <a href="#!" className="secondary-content">
          <i className="material-icons">grade</i>
        </a>
      </li>
    </>
  )
}
