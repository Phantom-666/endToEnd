import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import AuthContext from "../../Contexts/AuthContext"

type PropsType = {
  id : string,
  name : string
}


export default (props: PropsType) => {
  const histoty = useHistory()
  const {userId} = useContext(AuthContext)
  if (userId !== props.id) {
    return <li
    onClick={() => histoty.push(`/correspondence/${props.id}`)}
    className="collection-item"
  >
    <div>
      {props.name}
      <a href="#!" className="secondary-content">
        <i className="material-icons">send</i>
      </a>
    </div>
  </li>
  } else return null
}
