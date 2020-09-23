import React from "react"
import './items.css'
import {useHistory} from 'react-router-dom'


type PropsType = {
  mesWith : string
}

export default (props : PropsType) => {
    const history = useHistory()
    const goToContact = () => {
        history.push(`/correspondence/${props.mesWith}`)
    }

  return (
    <>
      <li className="collection-item avatar" onClick={goToContact}>
        <i className="material-icons circle green">insert_chart</i>
        <span className="title">{props.mesWith}</span>
        <a href="#!" className="secondary-content">
          <i className="material-icons">grade</i>
        </a>
      </li>
    </>
  )
}
